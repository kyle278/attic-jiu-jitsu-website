import { test } from "node:test";
import assert from "node:assert/strict";
import { forwardMemberRequest } from "../src/lib/server/member-proxy.ts";
function fixture(fetcher) {
  const writes = [],
    calls = [];
  return {
    writes,
    calls,
    config: {
      production: true,
      key: "server-only-secret",
      siteId: "owned-site",
      portalBaseUrl: "https://portal.example.invalid",
      store: {
        get: () => ({ value: "private-cookie-token" }),
        set: (...args) => writes.push(args),
      },
      fetcher: async (...args) => {
        calls.push(args);
        return fetcher(...args);
      },
    },
  };
}
const request = (body, origin = "https://academy.example.invalid") =>
  new Request("https://academy.example.invalid/members/api", {
    method: "POST",
    headers: {
      origin,
      "Content-Type": "application/json",
      "Idempotency-Key": "retry-key",
    },
    body: JSON.stringify(body),
  });
test("rejects cross-origin requests before accessing the upstream service", async () => {
  const f = fixture(() => {
    throw Error("must not fetch");
  });
  const r = await forwardMemberRequest(
    request({ action: "data" }, "https://attacker.invalid"),
    f.config,
  );
  assert.equal(r.status, 403);
  assert.equal(f.calls.length, 0);
  assert.equal(f.writes.length, 0);
});
test("stores verified sessions only in a secure HttpOnly host cookie and strips them from JSON", async () => {
  const f = fixture(() =>
    Response.json({
      ok: true,
      session_token: "opaque-session-secret",
      expires_at: "2026-12-01T00:00:00Z",
    }),
  );
  const r = await forwardMemberRequest(
    request({ action: "verify_code", input: { code: "12345678" } }),
    f.config,
  );
  assert.deepEqual(await r.json(), { ok: true });
  assert.equal(f.writes[0][0], "__Host-attic-member");
  assert.equal(f.writes[0][1], "opaque-session-secret");
  assert.deepEqual(
    { ...f.writes[0][2], expires: undefined },
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: undefined,
    },
  );
  assert.equal(r.headers.get("cache-control"), "no-store, private");
});
test("uses only configured site credentials and the server cookie, retaining the retry key", async () => {
  const f = fixture(() => Response.json({ ok: true }));
  const r = await forwardMemberRequest(
    request({
      action: "book",
      site_id: "attacker-site",
      session_token: "injected",
      input: { session_id: "class" },
    }),
    f.config,
  );
  const [url, init] = f.calls[0];
  assert.equal(
    url,
    "https://portal.example.invalid/api/websites/bookings/member-app",
  );
  assert.equal(JSON.parse(init.body).site_id, "owned-site");
  assert.equal(init.headers.Authorization, "Bearer server-only-secret");
  assert.equal(init.headers["x-member-session"], "private-cookie-token");
  assert.equal(init.headers["idempotency-key"], "retry-key");
  assert.equal(init.cache, "no-store");
  assert.ok(!(await r.text()).includes("secret"));
});
test("clears expired sessions and successful logout while preserving a session after an invalid code", async () => {
  const f = fixture(() => Response.json({ error: "expired" }, { status: 401 }));
  await forwardMemberRequest(request({ action: "data" }), f.config);
  assert.equal(f.writes[0][2].maxAge, 0);
  const g = fixture(() =>
    Response.json({ error: "invalid code" }, { status: 401 }),
  );
  await forwardMemberRequest(request({ action: "verify_code" }), g.config);
  assert.equal(g.writes.length, 0);
  const h = fixture(() => Response.json({ ok: true }));
  await forwardMemberRequest(request({ action: "logout" }), h.config);
  assert.equal(h.writes[0][2].maxAge, 0);
});
test("rejects malformed and oversized payloads without contacting Portal", async () => {
  const f = fixture(() => Response.json({ ok: true }));
  assert.equal(
    (await forwardMemberRequest(request({ action: "unknown" }), f.config))
      .status,
    400,
  );
  assert.equal(
    (
      await forwardMemberRequest(
        request({ action: "data", input: "x".repeat(5000) }),
        f.config,
      )
    ).status,
    413,
  );
  assert.equal(f.calls.length, 0);
});
test("reports upstream failure without disclosing server credentials", async () => {
  const f = fixture(() => {
    throw Error("server-only-secret");
  });
  const r = await forwardMemberRequest(request({ action: "data" }), f.config);
  assert.equal(r.status, 503);
  assert.ok(!(await r.text()).includes("secret"));
});

test("keeps the two-hour test credential in an HttpOnly browser cookie and clears it on normal logout", async () => {
  const f = fixture(() => Response.json({ test_token: "browser-test-secret", test_expires_at: "2026-10-25T20:00:00Z", email: "kyle@ingeniumconsulting.net", challenge: "test-challenge" }));
  const r = await forwardMemberRequest(request({ action: "test_signin" }), f.config);
  const payload = await r.json();
  assert.equal(payload.testing, true); assert.equal(payload.test_token, undefined);
  assert.equal(f.writes[0][0], "__Host-attic-member-test");
  assert.equal(f.writes[0][2].httpOnly, true); assert.equal(f.writes[0][2].secure, true);
  assert.equal(f.writes[1][0], "__Host-attic-member"); assert.equal(f.writes[1][2].maxAge, 0);
  const g = fixture(() => Response.json({ ok: true }));
  await forwardMemberRequest(request({ action: "logout" }), g.config);
  assert.equal(g.writes.find((write) => write[0] === "__Host-attic-member-test")[2].maxAge, 0);
});
