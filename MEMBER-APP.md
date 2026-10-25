# Attic member app

Share `https://attic-jiu-jitsu-website.vercel.app/members` directly with enabled members. The public website does not link to the app.

Portal staff provision existing customer contacts under Websites → Bookings → Member access. Each member receives an explicit class-access label, included classes, allowance, start and optional expiry. Staff saving an access record sends no email; the member requests a one-time code when signing in. Access records are not proof of payment. This release covers a member booking their own place in a class; household/guardian booking, appointment/course journeys and Stripe checkout remain separate work.

The app follows Portal's functional light UI with Attic branding tokens. The four destinations are Timetable, My bookings, Membership and Account. Desktop uses a sidebar; mobile uses bottom navigation. Members can see availability, book, cancel within the saved deadline and inspect their access details.

The shared member layout owns the app shell, session and in-memory data. Section links and browser back/forward preserve the header, navigation and timetable filters without repeating the session check. Initial entry uses a loading message specific to the requested section. Data still refreshes on focus, reconnect, explicit refresh and booking/cancellation; nothing private is persisted to browser storage.

The server-only `BOOKING_MEMBER_PROXY_KEY` environment variable connects this site to its fixed Portal site. Set it through the hosting environment, never NEXT_PUBLIC_* or source control. The `/members/api` proxy verifies same-origin JSON requests, forwards only the configured site and its private session cookie, and strips the backend session token before replying to the browser. The cookie is Secure, HttpOnly, SameSite=Lax and host-only in production. Authentication and all private replies are uncached.

Marketing routes live in `src/app/(website)` at their original URLs. Member routes use a separate shell without marketing tracking, navigation, footer or structured business schema. Member URLs have noindex metadata/headers and are omitted from the sitemap.

The manifest and service worker cover only `/members/`. The service worker caches only a static offline explanation; it never stores private pages or API replies and does not queue booking/cancellation writes. Add to Home Screen instructions appear on the sign-in page and Account. On iOS use Safari's Share menu; on supported Android/desktop browsers the native install prompt is used.

Verification: run `node --experimental-strip-types --test scripts/member-proxy.test.mjs` with Node 22+ to check the origin boundary, private server credentials, fixed site, cookie security and token stripping. Run `npm run build`, start the local server on port 3314, then run `node scripts/verify-member-app.mjs`. This isolated browser suite intercepts all member API calls with synthetic data, including a lost booking response and a retry with the same idempotency key. It does not send emails or make live reservations. Backend transaction and access tests live in the Portal repository.
