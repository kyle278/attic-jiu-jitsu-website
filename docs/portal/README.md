# Attic Portal connection

Site: `8b0e89c9-3090-46b2-b008-4d5c46233647`, organisation: `66f8a0e7-ffaa-4415-8261-e898609bcc74`.
Registered production origin: https://attic-jiu-jitsu-website.vercel.app.
Portal: https://portal.ingeniumconsulting.net.
Vercel project: `prj_RuAN4fGo7uZgcFNUOFtpe8AVywtJ`.

## Ownership and implementation

- Analytics deliberately migrate from the legacy tracker to hosted `ingenium-site-v2.js`. Only V2 is installed. Optional analytics default off; visitors can allow, decline or withdraw through the footer. Campaign storage follows the same choice. SPA route changes, existing marked actions, outbound/telephone/email links and engagement are instrumented without contact values or URL queries.
- The existing active Contact Form (`d4886e37-4c62-40eb-87e3-70f4fb5fe9a8`, slug `contact`) retains V1 form ingestion and its CRM mapping. This is separate from V2 analytics, using the UUID only on V1 requests and the public `site_` key only on V2 requests. Form submission does not depend on analytics. Native controls from all three steps remain mounted. Required privacy/accuracy and optional marketing checkboxes are explicit booleans. Honeypot rejection is not presented as a receipt. Values survive errors, success requires a real `submission_id`, and the synchronous UI lock blocks double clicks.
- V1 form intake does not expose server idempotency or the V2 Turnstile contract. The client blocks duplicate activation, but a lost response followed by a retry can produce a duplicate Portal record. V2 form migration requires a real registered Turnstile widget/secret; production has not been mislabeled as development to bypass that requirement.
- Editor SDK is adapted from the Portal reference SDK, reconciled with production Portal commit `832f784a3055708211f163fba89222cf7319c05f`. Stable source annotations and defaults live in `editor-registry.json`. Initial import registered six public pages, 568 page-region occurrences, plus an explicitly private member route. The exact field/section IDs are preserved for subsequent migrations. Do not rerun the position-based initial instrumenter.
- Public copy, marketing images, links and section presentation/composition use the site's original components and CSS. Shared header/footer/coaches preserve shared identities. Dynamic catalogue prices, membership terms, class records, availability, forms and member/payment actions retain their existing data owners. Gallery lightbox interaction and carousel controls remain application behaviour.
- Private editor grants travel through an origin/source checked MessageChannel and the website's signed server exchange. Query parameters enable bootstrap and side-effect suppression only. Preview routes receive private/no-store/noindex headers and exact Portal framing. Private member routes retain their original framing protections and are excluded from the public proxy.
- Managed SEO reads the durable CDN manifest and applies only defined overrides in server metadata, JSON-LD and redirects. Existing metadata remains the fallback. Schema output is escaped and merges without duplicate identities/types. Sitemap/canonicals identify the registered project origin. Signed delivery validates exact immutable revision identity, expires caches, probes actual public HTML, and acknowledges only after that same revision is rendered. No release status is manually forced live.

## Verification

`browser-verification.json`: all 30 integration browser checks passed locally and again on the exact staged production deployment, with no page errors. They cover consent states, one SPA page-view per route, required consent, failure preservation, accepted-only success, duplicate activation, independent forms, preview suppression, invalid signatures and six routes at 320/390/1440px. Form/event transport was mocked in that harness; live intake was then verified separately below.

Existing member regression: 30/30 browser checks and 10/10 member logic/proxy tests pass. All 37 original protected member/booking/API/library/root files remain byte-identical. Newly added `/api/ingenium/*` routes do not alter the member handlers.

Production deployment/release identities and live intake evidence are recorded in `release-verification.json`. The promoted application source is `12c39bec3780ff20ceb3faea7fd81f4f42db3a79`. Real consented V2 events reached the correct tenant, including SPA navigation; repeated client event IDs produced one stored record. Pending/refused/withdrawn consent produced no optional transmission and withdrawal cleared identifiers.

One clearly labelled synthetic enquiry was sent through the actual public form using the Forms skill. Receipt `3c56dff5-bec3-415c-8b79-9b557f97910b` belongs to Attic's existing site/form/organisation, carries privacy and accuracy `true`, marketing `false`, retained campaign attribution and the consented visitor link. It is not a class booking. Portal's existing form notification behaviour remains intact; staff can identify this test by its synthetic/no-action-needed message and `example.invalid` email.

All six public routes independently rendered editor baseline `5b03fd2c-0a38-47ef-8cbf-99a050012517`, generation 1. The signed callback acknowledged that authoritative release and unsigned delivery returned 401. Normal Portal SEO setup published baseline `362ceb91-7cde-4ed4-98b3-6a739c6cc8c7`; the live receiver acknowledged it, independent HTML showed the same revision, and Portal verification returned `verified: true` with no failures. An empty baseline proves delivery/activation, not a completed staff-authored override/edit/restore workflow.

The previous production deployment is `dpl_AxQGD3Ao9cq87aKq4rbdbkkcxuDF` (`attic-jiu-jitsu-website-jyha0i1py-kyle278s-projects.vercel.app`), source `0895683d93f59fda3dac8196b4c0f3d5440464fc`. Rollback can promote that deployment. The compatible new adapter retains its imported baseline and release identifiers; preserve signing secrets and Portal drafts when rolling forward again.

## Pending staff-session acceptance

The available Portal browser is signed in to Carlow Hearing, and shows no Attic website licence/access. No account access or licence was changed. A staff account with Attic Websites access must complete the private UI acceptance: nested selection, inline edit, private draft reload/isolation, image replacement, section changes, conflicts, grant expiry/replay, test publication and restore. A nonempty SEO override/redirect publication and restoration also remain staff-session acceptance work. Server configuration and baseline publication must not be described as proof of these private workflows.

Search Console is independent and was not requested or connected. The live Wix domain/DNS has not been changed. The new policy describes implemented collection; academy-specific retention periods, provider locations and transfer arrangements still require the academy's operational confirmation.
