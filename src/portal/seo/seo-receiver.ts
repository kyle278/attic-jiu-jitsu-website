/** Server-only website connection. Install beside ingenium-seo-adapter.ts. */
import { createHmac, timingSafeEqual } from "node:crypto";
import type { PublishedSeo } from "./seo-adapter";
export type SeoRevision = {
  id: string;
  revision: number;
  snapshot: PublishedSeo;
};
type Config = {
  portalOrigin: string;
  siteKey: string;
  secret: string;
  snapshotBaseUrl?: string;
  apply: (release: SeoRevision) => Promise<{ id: string; revision: number }>;
};
export function createSeoReceiver(config: Config) {
  const portal = new URL(config.portalOrigin);
  if (config.snapshotBaseUrl) {
    const base = new URL(config.snapshotBaseUrl);
    if (
      base.protocol !== "https:" ||
      base.username ||
      base.password ||
      base.search ||
      base.hash ||
      base.toString().endsWith("/")
    )
      throw new Error(
        "Configure an exact trusted HTTPS snapshot base URL without a trailing slash.",
      );
  }
  if (portal.protocol !== "https:" || config.secret.length < 32)
    throw new Error(
      "Configure a trusted HTTPS portal origin and a strong signing secret.",
    );
  return async (req: Request) => {
    const headers = { "Cache-Control": "no-store" };
    try {
      if (req.method !== "POST")
        return Response.json(
          { error: "Method not allowed" },
          { status: 405, headers },
        );
      const timestamp = req.headers.get("X-Ingenium-Timestamp") ?? "",
        signature = req.headers.get("X-Ingenium-Signature") ?? "",
        raw = await req.text();
      if (
        raw.length > 10000 ||
        !/^\d{13}$/.test(timestamp) ||
        Math.abs(Date.now() - Number(timestamp)) > 300000 ||
        !/^[a-f0-9]{64}$/i.test(signature)
      )
        return Response.json(
          { error: "Invalid signature" },
          { status: 401, headers },
        );
      const expected = createHmac("sha256", config.secret)
        .update(`${timestamp}.${raw}`)
        .digest();
      if (!timingSafeEqual(expected, Buffer.from(signature, "hex")))
        return Response.json(
          { error: "Invalid signature" },
          { status: 401, headers },
        );
      const message = JSON.parse(raw) as {
        type: string;
        site_key: string;
        revision: string;
        version: number;
        snapshot_url: string;
      };
      const url = new URL(message.snapshot_url);
      if (
        message.type !== "seo.publish" ||
        message.site_key !== config.siteKey ||
        !Number.isSafeInteger(message.version) ||
        message.version < 1 ||
        !/^[a-f0-9-]{36}$/i.test(message.revision) ||
        url.username ||
        url.password ||
        (config.snapshotBaseUrl
          ? url.toString() !==
            `${config.snapshotBaseUrl}/revisions/${message.revision}.json`
          : url.origin !== portal.origin ||
            url.pathname !== `/api/websites/seo/public/${config.siteKey}` ||
            url.search !== `?revision=${message.revision}`)
      )
        return Response.json(
          { error: "Wrong website or revision" },
          { status: 400, headers },
        );
      const response = await fetch(url, {
        redirect: "error",
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok || !response.body)
        throw new Error("Snapshot unavailable");
      const reader = response.body.getReader(),
        chunks: Uint8Array[] = [];
      let length = 0;
      while (true) {
        const next = await reader.read();
        if (next.done) break;
        length += next.value.length;
        if (length > 2 * 1024 * 1024) {
          await reader.cancel();
          throw new Error("Snapshot exceeds connection limit");
        }
        chunks.push(next.value);
      }
      const release = JSON.parse(
        Buffer.concat(chunks).toString("utf8"),
      ) as SeoRevision;
      if (
        release.id !== message.revision ||
        release.revision !== message.version ||
        release.snapshot?.schema_version !== 1 ||
        release.snapshot.site_key !== config.siteKey ||
        !Array.isArray(release.snapshot.pages) ||
        !Array.isArray(release.snapshot.redirects)
      )
        throw new Error("Snapshot identity mismatch");
      // apply must use durable storage and a monotonic compare-and-set. It returns
      // only when server metadata, JSON-LD and redirect readers serve this revision.
      const active = await config.apply(release);
      if (active.id !== release.id || active.revision !== release.revision)
        throw new Error("Revision is not active");
      return Response.json(
        { site_key: config.siteKey, revision: release.id },
        { headers },
      );
    } catch {
      return Response.json(
        {
          error:
            "SEO revision could not be applied. Previous revision remains available.",
        },
        { status: 409, headers },
      );
    }
  };
}
