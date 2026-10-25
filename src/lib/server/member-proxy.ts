type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  expires?: Date;
  maxAge?: number;
};
export type MemberProxyConfig = {
  production: boolean;
  key?: string;
  siteId: string;
  portalBaseUrl: string;
  fetcher?: typeof fetch;
  store: {
    get: (name: string) => { value: string } | undefined;
    set: (name: string, value: string, options: CookieOptions) => unknown;
  };
};
const headers = {
  "Cache-Control": "no-store, private",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
};
export async function forwardMemberRequest(
  req: Request,
  config: MemberProxyConfig,
) {
  const cookieName = config.production
    ? "__Host-attic-member"
    : "attic-member-dev";
  const testCookieName = config.production
    ? "__Host-attic-member-test"
    : "attic-member-test-dev";
  const origin = req.headers.get("origin");
  if (
    origin !== new URL(req.url).origin ||
    req.headers.get("sec-fetch-site") === "cross-site"
  )
    return Response.json(
      { error: "Request origin is not allowed." },
      { status: 403, headers },
    );
  if (!req.headers.get("content-type")?.startsWith("application/json"))
    return Response.json(
      { error: "Invalid request." },
      { status: 400, headers },
    );
  const raw = await req.text();
  if (raw.length > 4096)
    return Response.json(
      { error: "Request is too large." },
      { status: 413, headers },
    );
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json(
      { error: "Invalid request." },
      { status: 400, headers },
    );
  }
  if (
    ![
      "request_code",
      "verify_code",
      "data",
      "book",
      "cancel",
      "logout",
      "plans",
      "checkout",
      "checkout_status",
      "cancel_checkout",
      "billing_portal",
      "test_signin",
    ].includes(body?.action)
  )
    return Response.json(
      { error: "Invalid request." },
      { status: 400, headers },
    );
  const key = config.key;
  if (!key)
    return Response.json(
      { error: "Member access is being set up. Please contact the academy." },
      { status: 503, headers },
    );
  const store = config.store;
  try {
    const upstream = await (config.fetcher ?? fetch)(
      `${config.portalBaseUrl}/api/websites/bookings/member-app`,
      {
        method: "POST",
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
          "x-member-session": store.get(cookieName)?.value ?? "",
          "x-member-test-session": store.get(testCookieName)?.value ?? "",
          "x-member-client-ip":
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
            "unknown",
          "idempotency-key": req.headers.get("idempotency-key") ?? "",
        },
        body: JSON.stringify({
          site_id: config.siteId,
          action: body.action,
          input: body.input ?? {},
        }),
      },
    );
    const payload = await upstream
      .json()
      .catch(() => ({ error: "Member service is temporarily unavailable." }));
    if (
      body.action === "test_signin" &&
      upstream.ok &&
      typeof payload.test_token === "string"
    ) {
      store.set(testCookieName, payload.test_token, {
        httpOnly: true,
        secure: config.production,
        sameSite: "lax",
        path: "/",
        expires: new Date(payload.test_expires_at),
      });
      store.set(cookieName, "", {
        httpOnly: true,
        secure: config.production,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return Response.json(
        {
          challenge: payload.challenge,
          email: payload.email,
          testing: true,
          expires_at: payload.test_expires_at,
        },
        { headers },
      );
    }
    if (
      body.action === "verify_code" &&
      upstream.ok &&
      typeof payload.session_token === "string"
    ) {
      store.set(cookieName, payload.session_token, {
        httpOnly: true,
        secure: config.production,
        sameSite: "lax",
        path: "/",
        expires: new Date(payload.expires_at),
      });
      return Response.json({ ok: true }, { headers });
    }
    if (
      (body.action === "logout" && upstream.ok) ||
      (upstream.status === 401 && body.action !== "verify_code")
    )
      store.set(cookieName, "", {
        httpOnly: true,
        secure: config.production,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    if (body.action === "logout" && upstream.ok)
      store.set(testCookieName, "", {
        httpOnly: true,
        secure: config.production,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    const safePayload = { ...payload };
    delete safePayload.test_token;
    delete safePayload.session_token;
    return Response.json(safePayload, { status: upstream.status, headers });
  } catch {
    return Response.json(
      {
        error:
          "You’re offline or the member service is unavailable. Please try again.",
      },
      { status: 503, headers },
    );
  }
}
