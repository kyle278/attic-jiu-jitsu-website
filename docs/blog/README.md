# Attic Portal blog conversion

Prepared on 28 October 2026 for website `8b0e89c9-3090-46b2-b008-4d5c46233647`, organisation `66f8a0e7-ffaa-4415-8261-e898609bcc74`, at https://attic-jiu-jitsu-website.vercel.app.

## Current state

The website implementation is ready and tested locally. The eight guides have been converted into editable Blog v1 import documents with their original article paths, text, SEO titles, descriptions and links. **They have not yet been imported or published in Portal, and this conversion has not replaced the live website.** The existing production deployment continues to serve the original guides.

The trusted Blog setup endpoint configured this site's receiver and scoped signing secret. Its receipt is [connection.json](connection.json). The Blog remains disabled at generation 0 until an authorised editor completes the import and publication. Configuration is not delivery verification.

The available Portal browser is signed in as Carlow Hearing and the Attic Blog workspace returns “Website license required.” No roles, seats or licences were changed. Use an account that already has access to the Attic organisation's Websites product to finish the editorial steps. The Portal service credential was used only by its documented trusted deployment setup API; it was not installed on the website or used to bypass editorial permissions.

## Content and source files

- [guides-import.json](guides-import.json): eight native block documents. JSON import clears cross-site author/taxonomy associations; select the Attic author and relevant category before publication.
- [guides-markdown-import.json](guides-markdown-import.json): the same eight articles in the engine's batch Markdown format. Its author/category labels can match unambiguous existing Attic records. The native JSON version retains the explicit CTA block; Markdown represents that CTA as a standard editable link.
- [migration-source.json](migration-source.json): the original paths, metadata, paragraphs and links for content comparison. Source commit: `0527a72acbb7817ea2c5fa5ea52aa68b28b88471`.
- `scripts/export-guides-for-blog.mjs` regenerates these content-only exports deterministically from the recorded Git commit. Repeated imports use the Portal's normal content hash/provenance checks; do not create duplicate articles if it reports `already_imported`.

The original source date is retained in import provenance notes. The engine owns actual publication and modification timestamps; imports do not rewrite its lifecycle history.

## Website behaviour

- `/blog` and its article, search, category, author, tag and pagination routes read published-only Blog v1 responses with `no-store`. Arbitrary new published slugs work without a website rebuild. There is no hard-coded article fallback that can resurface a withdrawn post.
- One request-scoped result supplies article body, SEO, byline, taxonomy and immutable revision identity. Native article blocks render as React content; stored HTML/MDX is never executed. Unknown body versions or blocks fail closed.
- Blog owns metadata, article JSON-LD and permanent aliases within the exact `/blog` namespace. Existing SEO snapshots cannot override it. The rest of the website retains its managed SEO integration.
- The dynamic sitemap enumerates all current articles with cursor/generation handling. Noindex articles and alternative canonical destinations are excluded. RSS exposes the latest 50 public articles. Search and private previews request no indexing.
- Historical slugs issue real 308 redirects. Withdrawn routes retain 410 responses. Upstream failures return 503 with `Retry-After`, rather than false missing-article responses. The remaining public website stays available.
- `/api/ingenium/blog` verifies exact raw-body HMAC, timestamp, site, environment, release ID and safe paths against the durable current generation. It acknowledges receipt; Portal's independent output probe is required before claiming delivery is verified.
- `/api/ingenium/blog/preview` exchanges a one-time Portal code for a Secure/HttpOnly cookie restricted to `/blog`. Each private read is authenticated by Portal. Preview responses are no-store/noindex and excluded from optional analytics and attribution.
- Header/footer and programme-page links to the eight evergreen guides are website-owned navigation. If an editor intentionally withdraws one of those guides, update its curated incoming links as part of that editorial change. The engine's article listings, RSS and sitemap update automatically.

## Finish the live migration

1. Open [Attic's Blog workspace](https://portal.ingeniumconsulting.net/app/websites/blog?site=8b0e89c9-3090-46b2-b008-4d5c46233647) with an account that has existing Attic Websites administrator access.
2. Create/publish an author named `Attic Jiu Jitsu` with the academy background URL `/about-us`. Suggested categories are `Fitness`, `Starting jiu-jitsu` and `Kids & family`; publish them before publishing articles. Archive indexing can remain off to avoid thin label pages.
3. Use Blog settings' import validation first. Review all eight per-item results/warnings. Import into private drafts and confirm labels/author associations. Inspect at least one full draft and its SEO panel against the source document. Do not publish an arbitrary test article.
4. Enable the blog through normal versioned Blog settings. Publish all eight drafts to their existing slugs. During this preparation the current static production website remains intact; callback attempts may retry until the adapter is deployed.
5. Install only `INGENIUM_BLOG_SITE_KEY`, `INGENIUM_BLOG_SIGNING_SECRET` and `INGENIUM_BLOG_ENVIRONMENT=production` in the website's appropriate Vercel environments. The Portal origin is the existing trusted origin. Values are stored in the ignored local environment file; never commit the signing secret or copy Portal database/encryption credentials to Vercel.
6. Deploy the completed source to the existing production project. Verify all eight actual published revisions at their old URLs, titles/body/SEO, index, RSS, sitemap and authenticated preview. Use Blog Delivery to retry the newest release and obtain a genuine `verified` result from Portal's probes.
7. Check a private draft edit stays private and an intentional publication reaches the live site. Preserve each post/revision/release/generation receipt. Do not manually set release statuses or describe the local fixture as live delivery evidence.

## Verification completed

- Production build and ESLint passed for the implementation.
- `node --test scripts/blog-connection.test.mjs`: 15 tests passed, covering migration completeness, published/private DTO boundaries, safe links and inert rendering, exact namespace ownership, signed refresh boundaries, generation consistency, alias safety, full enumeration and dynamic feed/sitemap rules.
- `node scripts/verify-blog-http.mjs`: 19 isolated local HTTP checks passed using a test-only upstream fixture, including all eight original paths, draft/live separation, published edits, new slugs, 308 aliases, 410 withdrawal, outage/recovery, private previews and signed callback replay rejection. See [website-verification.json](website-verification.json). **No real Portal articles were created by this harness.**
- The 10 existing member-plan/proxy tests passed.
- The article layout was inspected at mobile and desktop widths, with no horizontal overflow. The existing branding is retained.

The test preload `scripts/verify-blog-fixture.mjs` is restricted to an explicit local test process and excluded from Vercel uploads. Its state is ignored by Git. The production application contains no fixture flag or alternate authority path.
