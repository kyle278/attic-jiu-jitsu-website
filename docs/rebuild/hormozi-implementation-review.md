# Hormozi implementation review

27 October 2026. Final implementation review, separate from the exactly two completed design critique rounds. Reviewed latest `build-brief.md` steering and `form-experience.md`, public code, and supplied QA screenshots. No source edits, browser/server launches, ad activity or live form submissions performed by this reviewer.

## Overall assessment

The implementation has a clear conversion proposition: real Carlow training, beginner welcome, actual coaches, current starter contents and a human enquiry. The darker user-directed identity is coherent, and the new full-width photographic opener is stronger visually than a generic card-based gym page. The screenshot shows the primary action and timetable together, with contextual beginner reassurance. Nothing in the reviewed public sales copy invents a free trial, saving, testimonial, urgency count or guaranteed result.

The commercial core is ready for root's consolidated fix pass. Main opportunities are to make motion controls fully truthful, shorten the timetable's initial footprint and make the success state more definite. None requires a booking change or another design cycle.

## Positive findings to retain

- **Actual offer, complete terms:** Home looks up `adults-beginners-program` deterministically and renders the catalogue name, price period and full description. The screenshot shows €160 / 2 months with the eight-week description and plan validity together, so the design does not silently convert the offer to a monthly subscription. Missing record has a truthful non-price fallback.
- **Memberships supports real decisions:** Source descriptions, price/term and contextual enquiry links remain visible. All checked catalogue categories, including distinct family options, appear in editorial rows rather than being hidden behind a pricing quiz. No “best value” or “most popular” designation is fabricated.
- **Honest enquiry semantics:** Home FAQ, starter helper, form first screen and form confirmation say enquiry is not reservation. Existing members have a clear `/members` route. This is a substantial improvement over the earlier free-trial/booking language.
- **Useful guided form:** The first choice asks intent rather than contact details; email response is disclosed immediately; parent guidance asks for adult details. Separate names, optional collapsed phone, editable plan/context message and independent required/optional consent are sensible. Visible SVGs are conventional controls with no mobile emoji clutter.
- **Material form reliability work exists:** All stages remain mounted and named; `[hidden]` is forced out of layout; explicit `noValidate` checks avoid the hidden-native-invalid-field failure. A synchronous step ref guards repeated intent activation. Error handling keeps values and genuine portal success controls reset. Source changes preserve the established field names and external events.
- **Attribution is treated separately from contact data:** Supported campaign fields survive browsing through session-only public storage; no contact/message draft is written there. Contextual plan links use the published name and existing message field. These choices preserve lead relevance without changing member APIs.
- **Dublin day grouping is corrected in public presentation:** `public-timetable.ts` formats a Europe/Dublin key rather than slicing UTC date text. Source timestamps and booking rules remain untouched.
- **Current visual direction is followed:** Hero and home screenshots are ink/charcoal throughout with off-white type and red actions. Mobile hero remains readable, with Start training and View timetable visible before the carousel footer; no arrows or emojis compete with those actions. Coach photography and real mats establish evidence rather than decorative hype.
- **The new privacy destination works as a real public page:** The form links it independently in a new tab; it explains observable enquiry, optional marketing, attribution and analytics behaviours without inventing a retention duration or processor geography. Operational particulars are appropriately not manufactured by a redesign.

## Prioritised negative findings and fixes

### P1 — Pause should stop the moving photograph as well as slide changes

**Location:** `src/components/hero-carousel.tsx:22`, `:32`, `:36`; `src/app/(website)/website.css:368`.

`running` controls the slide-change timeout, but it is not reflected in a class/data attribute or inline animation state. `.hero-slide.is-active img` always runs its 8.5-second Ken Burns animation under normal motion preference. Consequently Pause, pointer hover or keyboard focus stops slide changes while the large photograph continues to zoom. The visible Pause label and the build brief imply motion can be paused, so the control should govern the authored motion the visitor is watching.

**Fix:** Expose a paused/running state on the carousel and apply `animation-play-state: paused` to the active image when appropriate, preserving position rather than restarting it. Keep reduced motion static. Test Pause mid-zoom, hover/focus, previous/next and Play; controls should not briefly restart a motion sequence while focus is still inside the carousel. Do not remove the user-requested carousel or parallax.

### P2 — The initial timetable is much longer than the decision needs

**Location:** `src/app/(website)/classes/page.tsx`, `days` construction and `days.map`; supplied `classes-1440.png`.

The screenshot is roughly 7456px tall and the timetable renders the full current multi-week window before beginner/adult/youth explanations. This repeats the long-calendar weakness identified in the shared club research. A direct youth anchor avoids it for some visitors, but a parent entering Classes from navigation can scroll through several weeks of repeated sessions before understanding the programme. This is presentation friction, not a claim that any listed session is wrong.

**Fix:** Initially show a useful near-term range, then place later dates in a native “See later class dates” disclosure or a compact accessible date-range control. Preserve every source entry and original timestamp; do not change service availability or booking. Keep no-JS access to later dates. Add small visible Beginners / Adults / Kids & teens anchor links near the timetable heading so programme detail is not only reachable by scrolling the entire list.

### P2 — Make genuine submission success the dominant form state

**Location:** `src/components/contact-form.tsx:73–79`, `:142–150`.

On success the form resets to the initial four intent choices and places the confirmation in the feedback block beneath those choices. The live status is helpful for assistive technology, but visually this can resemble an unexplained reset and invite a repeated enquiry. This is static-code feedback; the root's mocked success screenshot should determine the exact visual severity.

**Fix:** After the genuine portal success event, show an obvious “Enquiry sent” heading, the current honest next-step message and phone fallback. Hide the fresh questionnaire behind an explicit “Send another enquiry” action or otherwise place the success message above it and move focus to it. Do not claim a reservation or response deadline. Keep the successful payload/reset behaviour and existing attribution values.

### P2 — Avoid competing full-size eager downloads in the carousel

**Location:** `src/components/hero-carousel.tsx:33`.

The first photo is preloaded while both hidden slides use `loading="eager"` and `sizes="100vw"`. That starts three large photographic requests at the opening, including on mobile where only one is visible. This is a resource-priority risk, not a measured LCP failure; root's performance check should decide whether it needs adjustment.

**Fix:** Preserve the first LCP request's priority, defer hidden slides until after the first image has loaded or just before they are needed, and use a consistent low-priority preload strategy thereafter. Do not trade the user's smooth crossfade for a flash of unloaded imagery. Confirm mobile initial transfer and first slide LCP rather than relying only on a static screenshot.

### P3 — The same technical-exchange photo repeats across prominent Home sections

**Location:** `src/app/(website)/page.tsx` beginner image and photo-story image; hero slide two in `hero-carousel.tsx`.

Gallery-10 appears in the carousel, the large beginner panel and the large training-life scene. It is a good photo, but this makes those sections feel less like different evidence. The full-home screenshot makes the duplicate large image particularly apparent.

**Fix if convenient within the consolidated pass:** Use a different inspected authentic photo for one of the two lower sections, retaining source truth and the named motion scene if possible. Keep this below the form/motion/timetable issues in priority. Do not add stock or generated people.

## Verification limits and acceptance

Screenshots inspected: `hero-1440.png`, `home-1440.png`, `hero-390.png`, `home-390.png`, `classes-1440.png`, and `memberships-1440.png` from `docs/rebuild/screenshots/one/`. Long screenshots were displayed downscaled; hero images were inspected at useful resolution. Read current form, carousel, attribution, membership, home, classes, policy, header and public helper code. Did not independently reproduce interactions because root is operating the single QA session.

Before delivery, root should rely on its captured non-delivery FormData and mocked event tests to verify every intent, separate consent choices, plan prefill, Back/edit, invalid hidden details, failure/retry and genuine success. Confirm campaign→Classes→Memberships→plan enquiry fields and Dublin boundary fixture. Protected booking hashes and public→Members appearance are separate checks; no review screenshot alone proves those. No production delivery, ad effectiveness or conversion lift is established by this review.
