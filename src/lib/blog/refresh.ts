import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { safeBlogPath } from "./routing";

export const refreshSchema = z.object({
  type: z.literal("blog.release"), api_version: z.literal(1), site_key: z.string().regex(/^blog_[a-f0-9]{32}$/),
  environment: z.string().min(1).max(100), release_id: z.string().uuid(), generation: z.number().int().nonnegative(),
  kind: z.string().max(100), post_id: z.string().uuid().nullable(), revision_id: z.string().uuid().nullable(),
  paths: z.array(z.string().max(1000).refine(safeBlogPath)).max(2000),
}).strict();

export function verifyBlogRefresh(raw: string, timestamp: string, signature: string, config: { key: string; secret: string; environment: string }, now = Date.now()) {
  if (Buffer.byteLength(raw) > 100000) return { ok: false as const, status: 413 };
  if (config.secret.length < 32 || !/^\d{13}$/.test(timestamp) || Math.abs(now - Number(timestamp)) > 300000 || !/^[a-f0-9]{64}$/i.test(signature)) return { ok: false as const, status: 401 };
  const expected = createHmac("sha256", config.secret).update(`${timestamp}.${raw}`).digest();
  if (!timingSafeEqual(expected, Buffer.from(signature, "hex"))) return { ok: false as const, status: 401 };
  let json: unknown;
  try { json = JSON.parse(raw); } catch { return { ok: false as const, status: 422 }; }
  const event = refreshSchema.safeParse(json);
  if (!event.success || event.data.site_key !== config.key || event.data.environment !== config.environment) return { ok: false as const, status: 422 };
  return { ok: true as const, event: event.data };
}
