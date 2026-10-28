import { z } from "zod";

export const safeUrl = z.string().max(2000).refine((value) => {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//") && !/[\\\u0000-\u001f]/.test(value)) return true;
  try {
    const url = new URL(value);
    return ["https:", "mailto:", "tel:"].includes(url.protocol) && !url.username && !url.password;
  } catch { return false; }
}, "Unsupported link URL.");

export const blockSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["paragraph", "heading", "list", "quote", "image", "callout", "cta", "table", "divider", "code"]),
  text: z.string().max(50000).default(""),
  level: z.number().int().min(2).max(4).default(2),
  ordered: z.boolean().default(false),
  media_id: z.string().uuid().optional(),
  alt: z.string().max(1000).default(""),
  decorative: z.boolean().default(false),
  caption: z.string().max(1000).default(""),
  href: safeUrl.default(""),
  label: z.string().max(200).default(""),
}).strict();

export const seoSchema = z.object({
  title: z.string().max(250).default(""),
  description: z.string().max(500).default(""),
  canonical: z.union([z.literal(""), z.url().refine((value) => new URL(value).protocol === "https:")]).default(""),
  noindex: z.boolean().default(false),
  social_title: z.string().max(250).default(""),
  social_description: z.string().max(500).default(""),
  social_media_id: z.string().uuid().optional(),
}).strict();

export const entitySchema = z.object({
  id: z.string().uuid(), kind: z.enum(["author", "category", "tag"]),
  name: z.string().min(1).max(200), slug: z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(5000).default(""), url: safeUrl.default(""),
  media_id: z.string().uuid().optional(), seo: seoSchema,
}).strict();

export const mediaSchema = z.object({
  id: z.string().uuid(), url: z.url().refine((value) => new URL(value).protocol === "https:"),
  width: z.number().int().positive(), height: z.number().int().positive(), alt: z.string().max(1000),
}).strict();

const publishedFields = {
  id: z.string().uuid(), revision_id: z.string().uuid(),
  title: z.string().max(200), slug: z.string().max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), excerpt: z.string().max(500),
  published_at: z.string().refine((value) => Number.isFinite(Date.parse(value))),
  modified_at: z.string().refine((value) => Number.isFinite(Date.parse(value))),
  url: z.url(), authors: z.array(entitySchema).max(5), categories: z.array(entitySchema).max(5), tags: z.array(entitySchema).max(10),
  media: z.record(z.string().uuid(), mediaSchema), seo: seoSchema,
  cover_media_id: z.string().uuid().optional(), cover_alt: z.string().max(1000), featured: z.boolean(),
  related_ids: z.array(z.string().uuid()).max(6), locale: z.literal("en"),
};

export const publishedArticleSchema = z.object({
  ...publishedFields, body: z.object({ version: z.literal(1), blocks: z.array(blockSchema).max(2000) }).strict(),
}).strict();
export const summarySchema = z.object(publishedFields).strict();
export const envelopeSchema = z.object({ api_version: z.literal(1), site_key: z.string().regex(/^blog_[a-f0-9]{32}$/), generation: z.number().int().nonnegative() });
export const manifestSchema = envelopeSchema.extend({
  enabled: z.boolean(), title: z.string().max(200), description: z.string().max(500), base_path: z.literal("/blog"),
  origin: z.url(), content_schema_versions: z.array(z.number().int()).refine((versions) => versions.includes(1)),
}).strict();
export const articleResultSchema = envelopeSchema.extend({
  post: publishedArticleSchema.optional(), redirect: z.object({ status: z.literal(308), path: z.string() }).strict().optional(),
}).strict().refine((result) => !!result.post !== !!result.redirect, "Expected one article or redirect.");
export const postsResultSchema = envelopeSchema.extend({ posts: z.array(summarySchema).max(50), total: z.number().int().nonnegative(), next_cursor: z.string().nullable() }).strict();
export const entitiesResultSchema = envelopeSchema.extend({ entities: z.array(entitySchema).max(1000) }).strict();
export const previewResultSchema = z.object({
  post: publishedArticleSchema.extend({ revision_id: z.union([z.string().uuid(), z.literal("preview")]) }), session: z.string().min(20).max(2000).optional(),
  expires_at: z.string().refine((value) => Number.isFinite(Date.parse(value))), base_path: z.literal("/blog"),
}).passthrough();

export type BlogBlock = z.infer<typeof blockSchema>;
export type PublicMedia = z.infer<typeof mediaSchema>;
export type PublicEntity = z.infer<typeof entitySchema>;
export type PublishedArticle = z.infer<typeof publishedArticleSchema>;
export type Summary = z.infer<typeof summarySchema>;
export type Manifest = z.infer<typeof manifestSchema>;
