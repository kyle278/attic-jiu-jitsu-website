# Taste plan v1 — Attic, in motion

Independent plan, 27 October 2026. Method: `tasteskill-taste-skill`. Evidence: root `research.md`, the existing repository, and the root inspection of atticbjj.net. No outside inspiration sources. This is a proposal for the public site only, not permission to change bookings.

## 1. Core decision

Build an editorial academy website that feels like the actual room: focused, welcoming and physical. The distinctive device is an **offset mat edge**: a thin red rule crossing from a left-aligned text column into the edge of a real training photograph. It is used in the hero, programme navigation and the final enquiry section. It is not another logo, decorative martial-arts clip art, a repeated card frame or an animated background.

The visitor should understand these things in order: this is Brazilian jiu jitsu in Carlow; beginners can join; there is a suitable adult or youth route; real coaches teach here; class times and membership details are available; the first step is an enquiry, not a confirmed reservation.

Taste dials are design variance 8, motion intensity 6 and density 4 on desktop. Asymmetry comes from column proportions, image crops and deliberately varied section rhythm. Mobile becomes a strict single column. The user’s evidence restriction overrides the skill’s suggested replacement fonts, outside palettes, perpetual effects and SaaS bento patterns. Those would dilute Attic and add motion with no useful task.

## 2. Evidence to design translation

- AOJ and the beginner-focused club examples establish the value of an immediate route into the right programme. Use visible linked rows, not an obscure quiz.
- Grange/D15 demonstrate the importance of answering first-class worries. Place practical answers before the enquiry rather than burying them on a separate page.
- Third Space shows how real places make membership tangible. Use the real academy photographs as primary evidence; do not promise facilities or services absent from Attic.
- Barry’s has a recognisable place and a coherent first-timer route. Attic’s equivalent is the mat-edge visual and a consistent “Start training” action. Do not import Barry’s offer.
- basement/Lusion show how a small number of choreographed scenes can establish identity. Use one hero entrance and one restrained scroll composition. The site remains a conventional, easy-to-read local business website.
- Wix establishes black/white photography, a red identity, a warm local invitation and block display type. The repository’s Barlow Condensed and Source Sans 3 preserve that relationship without introducing Wix’s overflow problem.

## 3. Art direction and design system

Retain `--font-heading` Barlow Condensed and `--font-body` Source Sans 3 from the unchanged root layout. Barlow 600/700 is for short headings, navigation labels and price emphasis. Body copy stays sentence case. Display tracking is approximately -0.015em to 0.015em, never the current widely tracked long uppercase paragraphs. Heading line-height 0.98–1.06; body 1.55–1.7 and maximum 58–64 characters per line.

Palette is ink `#0f0c0d`, chalk `#f7f3f1`, Attic red `#c43148`, warm grey for dividers and secondary copy derived from these existing tones. Red is an action/boundary colour; no red fog, extra bronze accent, gradients, glows or luxury gold. Check actual text contrast before shipping: red text on chalk needs sufficient size/weight or a darker scoped red text token; body text never relies on a weak grey. Primary buttons use red with high-contrast text, square or 2px corners, minimum 48px tall. Secondary links use underlines and a simple CSS arrow. Avoid a new icon dependency.

Desktop container maximum 1320px; normal gutters 48px, large screens 64px. Main layout is a 12-column grid with combinations 5/7, 7/5 and 4/8. Section spacing 88–112px. Full-bleed images may cross the grid, but all text shares the same left grid. Tablet gutters 28px; mobile 20px and section spacing 48–64px. At 320px, gutters reduce to 16px and text must wrap naturally.

Hero H1 uses `clamp(3.25rem, 6.4vw, 6.25rem)`, short three-line maximum copy on desktop, usually two to three lines on mobile. Never force nowrap or a desktop line break that clips a narrow screen. H2 38–56px desktop and 32–40px mobile; body 18px desktop, 16–18px mobile. Do not turn every secondary title into a display heading.

Photography is authentic: use the existing black-and-white hero and coaches, then restrained natural colour in the training gallery. Inspection of `asset-sheet.jpg` confirms gallery-10 shows a readable two-person technical exchange with a red mat wall and is suitable for a broad home composition; gallery-7 is a close partner/coach detail; gallery-3/5 show throws and should not lead the beginner welcome. `hero.jpg` is a cropped logo, not a training image: never use it as the new photographic hero. Use `hero-live.jpeg` only after checking its portrait crop on desktop. Preserve embedded photographer credits; don't cover them with UI or crop them out when feasible. When a crop excludes a credit, transcribe the actual credit to a visible adjacent caption after inspecting the source, never invent the name. Image captions stay below photographs. Coach portraits use natural aspect ratio and measured cropping. No AI images or stock people.

## 4. Shared shell and navigation

Header: ink bar, logo 46–52px, text wordmark, desktop links Classes, Memberships, About, Gallery. Home remains accessible through the logo and footer. Member entrance is a quieter but clearly labelled “Members” link to `/members`; primary “Start training” goes to `/#trial-form`. Classes link reaches `/classes`, while a text link in the hero reaches `/classes#live-schedule` directly. Avoid three competing header buttons.

Keep sticky header at 72–80px desktop, 68–72px mobile. Add visible-on-focus skip link to the public `main`; set anchor scroll margin to header height plus 20px. Active page uses a red bottom rule and `aria-current="page"`, not colour alone. Desktop nav link underlines animate without moving surrounding items.

Below 1024px, show logo, compact Start training link only if space allows, and Menu button. Menu is an in-flow disclosure panel, not a cinematic full-screen overlay: semantic nav, `aria-expanded`, `aria-controls`, Escape closes, opening does not strand keyboard focus. Link selection closes it; navigation changes close it. At 320px the menu never depends on horizontal overflow. The menu holds member access and all public destinations.

Footer has name, full postal address, telephone, email, verified Instagram/Facebook links, public route list and Members. No invented opening hours, policy links or awards. Reuse schema/tracker integration unchanged within the public layout.

## 5. Home `/` — a deliberately paced story

### A. Hero: 5/7 split, ink, real photography

Left copy is separated from the photo so readability does not depend on a dark overlay. Small location line: “Brazilian jiu jitsu · Carlow”. H1: **“Your first class.\nYour next challenge.”** Supporting copy: “Learn Brazilian jiu jitsu with Attic. Beginner, adult, kids and teens classes, with gi and no-gi training in Carlow.” Primary “Start training”; secondary “View timetable”. Below: “New to jiu jitsu? We’ll help you choose a class.”

Right photo is slightly inset at top, flush to the container’s right edge, with one red mat-edge rule at its lower third. Caption under image: “On the mats at Attic Jiu Jitsu.” No overlaid selling paragraphs. Hero should show the key actions without scroll on a typical 1366×768 screen; do not impose full viewport height. Mobile text precedes a 4:3 image; key action precedes the image.

### B. Proof as one line, not metrics

Chalk strip with three factual text items separated by rules: “Beginners welcome” / “Adults, kids & teens” / “Gi & no-gi”. These are text, not fake review scores or animated counters. On mobile wrap to three short lines without cramped tiny type.

### C. Find your class: chalk 4/8 split

Left H2: “There’s a place to start.” Right three large linked rows with number, title, one sentence and arrow. “New to jiu jitsu” → `/classes` appropriate beginner section; “Already training” → mixed-level details; “Kids & teens” → youth details on `/classes`. The whole row is the link, minimum 80px tall. No hidden hover content. Use existing route plus new stable optional section anchors while retaining all existing anchors.

Exact descriptions: “Learn the fundamentals with a clear beginner route.” / “Keep developing your technique through gi, no-gi and coached training.” / “Age-appropriate classes for younger students.” Avoid guaranteed confidence, fitness or safety outcomes.

### D. A tangible beginner option: ink 7/5 split

H2 “Start with the essentials.” Intro: “A beginner programme gives you a clear route into training. See the published options and ask the team what suits you.” Render the adult beginner plan from the current catalogue, including its exact name, published price, term and description. Visually separate cost from duration. Gear is named only when the live plan description confirms it. Link “Explore memberships” → `/memberships#live-plans`; small “Ask about this programme” → enquiry. If no matching beginner plan exists, render useful explanatory copy and membership link rather than a fabricated €160 offer.

An adjacent real training detail photo supports it. Avoid rating it “Most popular” or “Best value” without evidence.

### E. Coaches: open chalk editorial portraits

H2: “Meet the people teaching you.” Two coach profiles use unequal photo sizes and alternating alignment, rather than equal boxed cards. Darren Curtis: “Darren began training in 2009 and brings black belt coaching experience to the mats.” Brian Connolly: “Brian began training in 2009, received his black belt in 2022, and coaches kids and teens.” Use factual current repository roles. Link “About the academy” → `/about-us`. Keep the copy short on home; the full story belongs on About.

### F. One image-led motion moment

Ink section, broad academy photograph across 8 columns, a second smaller photograph offset below-right, caption and H2 in the remaining space: “Get a feel for the room.” Copy: “Real training, coaching and time on the mats.” Link “Inside Attic” → `/gallery`. On desktop only, two photo planes move at different restrained rates as the section passes the viewport. The label and CTA stay fixed in normal flow. Mobile uses a plain stacked photo pair. No horizontal scroll hijack, autoplay carousel or sticky trap.

### G. First-class questions: chalk

H2 “Before you step on the mats.” Four/five native details accordions: beginners welcome, gi versus no-gi, what to bring, kids/teens classes, choosing a class. Example copy: “Gi classes use the traditional training jacket and trousers. No-gi classes train without the gi. Ask the team which class and clothing suit your first visit.” For what to bring, reuse verified clothing/water advice and ask the team to confirm equipment. Avoid stronger safety guarantees or a claim that every session suits all fitness/experience levels. Accordion marker is a CSS plus/minus; each summary has a clear focus ring.

### H. Location and enquiry: ink, final mat edge

H2 “Plan your first class.” Body: “Tell us who will be training and what you’d like to know. The team can help you choose a class or membership.” Address `4 Charlotte St, Graigue, Carlow, R93 D431`, click-to-call and email visibly available beside the form. Use an external map link only after confirming its destination, not an invented map pin or decorative screenshot. Under form action: “This sends an enquiry. Your class is confirmed with the academy.”

Keep existing form `id="trial-form"`, portal integration, field names, data attributes, hidden attribution inputs and consent requirements. Redesign presentation and humane microcopy: Step 1 “Your details”; Step 2 “How we can contact you”. Replace the existing “boring GDPR” language. Preserve required and optional distinction. Do not invent a response-time promise.

## 6. Classes `/classes`

Compact chalk editorial intro, H1 “Find your class.” Body: “Beginner or experienced, adult or younger student—explore the classes at Attic and ask us where to start.” Direct in-page “View timetable” and Start training actions. This is a task page: the timetable should appear within the first desktop screen or close to it, not after a long atmosphere story.

Before the timetable, a short two-column explainer: “Gi” and “No-gi” in plain language, plus a link to beginner help. Then `#live-schedule`: existing read-only catalogue/getTimetable output. Group by date with explicit “Carlow time” or “Europe/Dublin”. Desktop two date columns maximum; rows contain time, name, duration and real coach only when provided. Mobile date stacks with time in a stable 75–90px column. Preserve exact date/time semantics. No capacity claims or booking actions added to the public table.

State copy: no published sessions → “The next class times aren’t listed here yet. Contact the academy for the current timetable.” If upstream fallback is being used, do not label it “live”. Catalogue failure must not take down the entire page; preserve the existing server helper’s semantics and provide contact where supported, without editing the helper.

Below schedule, full catalogue class descriptions grouped meaningfully into beginners/adults/youth where classification is reliable. Unknown classes stay in “More training” rather than disappearing. Native section anchors supply the home routes. Youth copy may show the live site’s kids 6–11/teens 12–15 only if current class data does not contradict it; otherwise omit hard ages and ask the team. Conclude with enquiry plus Members link for existing students. Existing booking app is only linked, never embedded/rebuilt.

## 7. Memberships `/memberships`

H1 “Make training part of your week.” Intro: “Beginner programmes, adult memberships and options for younger students and families.” Left aligned short intro. A small jump navigation lists only nonempty groups using actual catalogue audience labels. `#live-plans` remains.

Use structured editorial pricing rows instead of a three-column SaaS pricing grid. A beginner programme may receive a broad red-edge feature panel when actually present; all other plans use two-column desktop rows: name/detail on left, price/term/action on right. Mobile stacks name, clear cost, detail and “Ask about this plan”. Never trim important usage limits. Do not split price text into a false monthly denomination. Preserve catalogue strings and explain terms only when supplied.

Show all published plans including unexpected audience groups; filter empty groups. No invented most-popular labels, saving calculations, crossed-out prices or checkout buttons. Footer note: “Memberships and payments are arranged with the academy. Contact us to confirm eligibility, family coverage and your start date.” Keep `#member-area` and present “Already a member?” plus `/members` link clearly. This alters public access presentation only.

No plans state: “Contact the academy for current memberships and pricing.” Show phone/enquiry, no empty category frames or static stale replacement prices.

## 8. About `/about-us`

H1 “Good coaching. A welcoming room.” Split introduction and wide actual training image. Explain Attic as a Carlow academy for beginners and ongoing students, without the unsupported exclusivity claim. Use a short “How we train” section of three ruled paragraphs, not generic value cards: technical instruction, training partners, adult/youth routes. Avoid promising outcomes.

Large Darren and Brian profile sections alternate 5/7 and 7/5, photo then factual biography. Timeline facts may say each began training in 2009 and Brian’s black belt in 2022; do not invent Attic’s founding date or expand competition claims. Omit inconsistent lineage spelling. A clear “Explore classes” follows coach proof. Final location/enquiry strip repeats full address, phone, Start training. No second full form needed.

## 9. Gallery `/gallery`

H1 “Life on the mats.” Intro: “Training partners, technical details and coaching at Attic in Carlow.” Existing category metadata can power filters but no new labels may imply programmes absent from catalogue. Default all images visible. Desktop two-column editorial grid with alternating 4:3 and 3:2 crops, every fourth image spanning full width; mobile single column. Preserve credits and captions. Do not use dense tiny thumbnails beside a giant active image that pushes half the gallery off-screen.

Optional image modal is a native dialog with visible Close, previous/next controls, image counter, caption, arrow-key support, Escape, focus management and focus return to trigger. Full image uses contain, so embedded credits remain visible. Filtering communicates count with polite live text and retains focus on the selected filter. Empty state offers “Show all photos”. No-JS fallback is the full gallery and normal full-image links. Final Start training action is concise.

## 10. Motion specification

| Element | Trigger and sequence | Duration/easing | Fallback and guardrail |
|---|---|---|---|
| Hero headline | On first page mount, 12px translate to rest; two text blocks follow with 80ms offsets | 680ms, cubic-bezier(.16,1,.3,1), total under 900ms | Server HTML visible. Do not initially opacity:0 essential text. Reduced motion: no transforms/entrance. |
| Hero image | On mount, scale 1.045→1 and optional 14px translation | 850ms same ease, starts 60ms | Image area reserved; image and CTA are never waiting for a loader. |
| Mat-edge rule | Hero once, scaleX .85→1 from left | 600ms, begins 150ms | Decorative only; static under reduced motion. |
| Programme row | Hover/focus arrow +4px and underline | 180ms ease-out | Keyboard sees focus independently. No pointer-following movement. |
| Main CTA | Hover background darkens, arrow +3px; active scale .985 | 180ms / 80ms | Focus ring stable; only control responds, no magnetic cursor. |
| Photo composition | Desktop fine pointer, intersection-gated scroll composition, image translateY within ±28px and ±14px | Native scroll timeline where supported; bounded transform | Static unsupported browser, mobile/coarse pointer and reduced motion. No scroll listeners. |
| Menu disclosure | Panel opacity/translateY 6px | 180–220ms | Nav readable without transition; no height animation or delayed links. |
| FAQ | Native immediate opening, marker rotates to minus | 160ms | No animated auto-height. Essential answer appears instantly. |
| Gallery filter | New set opacity and 6px translate, DOM order stable | 180ms, stagger capped at 30ms/item/180ms total | No reorder springs required. Reduced motion immediate. |
| Gallery modal | Dialog opacity and image scale .985→1 | 180ms | Full control available immediately, reduced motion instant. |
| Form step | Update then focus step heading, no whole-form jumping animation | 140ms opacity only | Validation first; hidden step never traps invalid required fields. |

Do not animate every section. Coach profiles and timetable remain still. No autoplay, perpetual breathing dots, typewriters, text scrambling, cursor replacement, audio, 3D loading scene or route transition that delays reading. Native transitions provide advanced compositional confidence without importing a motion library for its own sake.

## 11. Component and technical plan

Dependencies checked: Next 16.2.0, React/React DOM 19.2.4, Tailwind 4. No motion, GSAP, icon or component library exists. Proposed implementation uses CSS, IntersectionObserver and Web Animations only in an isolated public motion leaf. If a different motion library is later selected, explicitly install it and isolate its client boundary. No unverified import paths.

Before writing Next code, read the installed relevant Next 16 docs, especially App Router server/client boundaries, CSS and Image/Link. Public pages remain Server Components; tiny client leaves own mobile nav, optional gallery and existing enquiry UI. Add `.website-shell` in `(website)/layout.tsx` and import a route-group stylesheet with every selector scoped below it. Inherited root/global fonts remain intact. Explicitly reset prior public pill/radius/gradient styles under this scope rather than editing global definitions. Root layout and globals stay byte-identical.

Possible public components: `AcademyHero`, `ProgrammeLinks`, `PlanRows`, `CoachProfile`, `PublicTimetable`, `AcademyGallery`, `PublicMotion`. Keep copy local to marketing pages/components because `src/lib/**` is protected. Consume catalogue and static constants read-only. Keep tracker script, schema and hidden form attribution. Do not accidentally create a full-site client tree.

Protected: `src/app/members/**`, all APIs, `src/components/members/**`, member portal, `src/lib/**`, `src/generated/**`, `public/members/**` and member scripts. Root can hash these before and after, including root layout/globals, and compare no change. Do not run sync scripts or mutate catalogue data to make a marketing layout easier.

## 12. States, accessibility and verification

- All actions have text names. No decorative arrows announced by assistive technology. Maintain one H1, ordered headings and explicit landmarks.
- Reserve image dimensions; use sizes, priority only for hero. Compress through existing Next image handling; lazy-load below-fold imagery. Do not preload gallery images.
- Forms: labels above fields, required fields marked, helper/error below, autocomplete, focus first invalid input. Errors must be associated with inputs; general status is live. Keep input values on failed submit. Show Sending state on the button and prevent duplicate submissions. Success says enquiry sent and class still needs confirmation. Optional marketing is off by default. Keep existing contract intact.
- Catalogue empty/error paths still give a clear next action, and no empty group headings. Avoid “live” where freshness cannot be established.
- Header/menu keyboard test; FAQ keyboard test; modal keyboard/screen-reader/focus return test. At 200% zoom content remains reachable and sticky header does not hide anchors.
- Verify at 320, 390, 768, 1024 and 1440px. No horizontal page scroll; contrast, 44–48px targets, no photo-credit clipping on full images, long real plan titles and prices wrap without breaking alignment.
- Test reduced motion, JavaScript disabled, slow image loading, no timetable entries, no beginner plan and missing price fields through safe read-only fixtures/inspection, never by editing business data.
- Run lint and production build, then browser inspect every public route plus `/members` for preserved appearance/navigation. Confirm enquiry hook/data attributes remain and do not submit production test leads without a suitable agreed test path.

## 13. Risks and choices to challenge in peer review

1. The confident black-and-white style could feel intimidating. Counter with readable bright sections, plain beginner copy and real coaching imagery rather than aggression.
2. Asymmetric crop choices can hide faces or photographer credits. Require visual review per breakpoint and full-image modal containment.
3. Catalogue metadata may not classify beginner/youth reliably. Never discard unmatched entries or force invented labels; generic fallback route stays useful.
4. A two-step enquiry introduces friction, but changing the integration schema or consent requirements is outside this design plan. Make its steps and language clearer first.
5. Native scroll timelines vary by browser. Treat them as enhancement; static composition must look equally deliberate.
6. An image-led gallery modal is additional complexity. If time constrains robust keyboard implementation, ship a strong static gallery with full-size image links rather than the current inaccessible overlay.
