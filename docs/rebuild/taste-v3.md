# Taste final plan v3 — Attic, in motion

Final plan, 27 October 2026, after exactly TWO coordinated cross-critique/revision rounds. Method: `tasteskill-taste-skill`. Evidence: root `research.md`, the existing repository, and the root inspection of atticbjj.net. No outside inspiration sources. Public website only; bookings stay untouched. The root will compile and implement, then request a separate implementation review; no third design round.

### Round-one change log

Accepted from both peers: explicit preservation/serialization of first-step form values; neutral verified gallery captions instead of unsafe filters; no-JS native navigation and image anchors; direct enquiry as the starter panel's primary action; a compact first-visit sequence at the form; one factual coaching proof item; explicit current Next image guidance; a single committed scroll scene with static fallback. Accepted Pro Design's portrait crop/credit rule, non-ordinal programme alternatives and clearer jiu-jitsu H1. Accepted Hormozi's requirement that plan interest either be carried visibly or CTA wording remain generic; use generic membership enquiry with a visible plan-name prompt and unchanged payload schema.

Kept deliberately: editorial membership rows, early timetable and one precise photo-motion moment. Rejected a second transformed photo plane and gallery waterfall motion as unnecessary competing effects. Do not add another full first-visit Home section. The primary label may vary contextually, but every newcomer primary action reaches the same enquiry anchor and never books a class.

### Round-two final change log

Accepted both peers: cap the actual desktop portrait geometry, use Europe/Dublin day keys instead of UTC string slicing, add 40px inner photo overscan with static external credit, specify short-screen acceptance, add a stable starter anchor, test attribution through a complete browse path, and prevent native hidden-field constraint validation from blocking submission. Adopt the root’s final choices: `noValidate` plus explicit step validation; plan URLs `/?plan=ENCODED_PUBLISHED_NAME#trial-form` with a visible editable existing-message prefill; session-only public UTM attribution persistence, storing no personal/contact data. This replaces v2's generic membership prompt decision with a concrete contextual path. Accepted Pro Design's finite two-batch verification. No substantive final feedback rejected; no extra feature/motion section is added.

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

Below 1024px, show logo, compact Start training link only if space allows, and a native details/summary Menu disclosure. Its semantic navigation works without JavaScript. Optional client enhancement closes on Escape, link selection and route change, returning focus to the toggle after Escape. It remains an in-flow panel rather than a full-screen overlay. At 320px the menu never depends on horizontal overflow. It holds every public destination plus direct “View timetable” and Members links. If the implementation instead retains the existing button model, add an explicit noscript route list; a nonfunctional mobile Menu button is unacceptable.

Footer has name, full postal address, telephone, email, verified Instagram/Facebook links, public route list and Members. No invented opening hours, policy links or awards. Reuse schema/tracker integration unchanged within the public layout.

## 5. Home `/` — a deliberately paced story

### A. Hero: 5/7 split, ink, real photography

Left copy is separated from the photo so readability does not depend on a dark overlay. Small location line: “Brazilian jiu jitsu · Carlow”. H1: **“Serious jiu jitsu.\nA place to start.”** Supporting copy: “Learn Brazilian jiu jitsu with Attic. Beginner, adult, kids and teens classes, with gi and no-gi training in Carlow.” Primary “Start training”; secondary “View timetable”. Below: “New to jiu jitsu? We’ll help you choose a class.”

Right photographic track is 7 of 12 semantic grid columns, but the actual portrait is narrower within that track; the photo must not stretch to its entire width and create a 1000px hero. Desktop inner image block is capped at 580px tall (up to 620px only on taller viewports), near-natural 2:3 ratio, width approximately 387px at the 580px cap, aligned right. Use object-contain so the participants and bottom credit remain readable; the surrounding ink/negative space is intentional. Text/action column is top-aligned with its own predictable 48–64px top spacing, never bottom-aligned to a huge image. One red mat-edge rule crosses into the photo's visible edge. Hero total is content-driven with 24–48px breathing room, not a viewport minimum. At 1366×768 the actual header, heading and both actions must be visible; reduce top/bottom spacing before shrinking readable body type. Caption: “On the mats at Attic Jiu Jitsu.” Mobile text/actions precede a near-natural uncropped 2:3 image; complete words and natural flow matter more than a two/three-line headline target. If any art-directed crop is used after inspection, preserve both faces/connected arms and reproduce its exact verified photographer credit adjacent to the photograph. Never put credit inside a moving layer or cover it with a control.

### B. Proof as one line, not metrics

Chalk strip with three factual text items separated by rules: “Coaches training since 2009” / “Adults, kids & teens” / “Gi & no-gi”. The date is coaching history, never Attic's founding date. These are text, not fake review scores or animated counters. On mobile wrap to three short lines without cramped tiny type.

### C. Find your class: chalk 4/8 split

Left H2: “There’s a place to start.” Right three large linked rows with title, one sentence and arrow; no ordinal numbers because these are alternatives, not steps. “New to jiu jitsu” → `/classes#beginners`; “Already training” → `/classes#live-schedule`; “Kids & teens” → `/classes#youth`. The whole row is the link, minimum 80px tall. No hidden hover content. Add those public detail anchors while retaining all existing anchors.

Exact descriptions: “Learn the fundamentals with a clear beginner route.” / “Keep developing your technique through gi, no-gi and coached training.” / “Age-appropriate classes for younger students.” Avoid guaranteed confidence, fitness or safety outcomes.

### D. A tangible beginner option: ink 7/5 split

Stable section ID `beginner-programme` remains whether or not its catalogue record exists. H2 “A clear way to begin.” Intro: “A beginner programme gives you a clear route into training. See the published options and ask the team what suits you.” Render the adult beginner plan from the current catalogue, selected by a verified stable ID/slug, including its exact name, published price, term and full description. Visually separate cost from duration. Gear is named only in the source-backed description; no brittle prose-to-benefits parser or unguarded kit headline. Primary “Ask about this programme” → `/?plan=URL_ENCODED_PUBLISHED_NAME#trial-form`, carrying the actual displayed name. Secondary “Explore memberships” → `/memberships#live-plans`. The final form visibly prefills the existing editable message field and labels the selected interest; this remains an enquiry, never a reservation. If no matching beginner plan exists, render useful explanatory copy and generic enquiry/membership link rather than a fabricated €160 offer; stable heading and anchor remain useful.

An adjacent real training detail photo supports it. Avoid rating it “Most popular” or “Best value” without evidence.

### E. Coaches: open chalk editorial portraits

H2: “Meet the people teaching you.” Two coach profiles use unequal photo sizes and alternating alignment, rather than equal boxed cards. Darren Curtis: “Darren began training in 2009 and brings black belt coaching experience to the mats.” Brian Connolly: “Brian began training in 2009, received his black belt in 2022, and coaches kids and teens.” Use factual current repository roles. Link “About the academy” → `/about-us`. Keep the copy short on home; the full story belongs on About.

### F. One image-led motion moment

Ink section, broad academy photograph gallery-10 across 8 columns, a second static gallery-7 detail offset below-right, caption and H2 in remaining space: “Get a feel for the room.” Copy: “Real training, coaching and time on the mats.” Link “Inside Attic” → `/gallery`. This is the one committed advanced photo composition. Desktop ≥1080px, fine pointer and reduced-motion false: move only the main image from translateY(18px) to translateY(-18px) over its named native CSS view timeline, entry to exit. The reserved outer frame clips the inner image, which has 40px total vertical overscan (20px at each edge), so both transform endpoints remain filled. Caption/verified credit stay outside the transformed layer. The second photo, label and CTA stay static in normal flow. Use `@supports (animation-timeline: view())`; unsupported browsers, mobile and reduced motion see the complete static composition. No JS scroll listener, rAF fallback, pinning, extra page height or animation dependency. Mobile uses a plain stacked photo pair.

### G. First-class questions: chalk

H2 “Before you step on the mats.” Four/five native details accordions: beginners welcome, gi versus no-gi, what to bring, kids/teens classes, choosing a class. Example copy: “Gi classes use the traditional training jacket and trousers. No-gi classes train without the gi. Ask the team which class and clothing suit your first visit.” For what to bring, reuse verified clothing/water advice and ask the team to confirm equipment. Avoid stronger safety guarantees or a claim that every session suits all fitness/experience levels. Accordion marker is a CSS plus/minus; each summary has a clear focus ring.

### H. Location and enquiry: ink, final mat edge

H2 “Plan your first class.” Body: “Tell us who will be training and what you’d like to know. The team can help you choose a class or membership.” Compact visible three-step sequence beside the form: “Send an enquiry” / “Discuss a suitable class” / “Attend once arrangements are confirmed”. It is a short real sequence, not another full Home section or a promised turnaround. Address `4 Charlotte St, Graigue, Carlow, R93 D431`, click-to-call and email visibly available beside the form. Use an external map link only after confirming its destination, not an invented map pin or decorative screenshot. Under form action: “This sends an enquiry. Your class is confirmed with the academy.”

Keep existing form `id="trial-form"`, portal integration, field names, data attributes, hidden attribution inputs and consent requirements. Fix current uncontrolled-input unmounting: both step wrappers remain mounted, hide only the inactive step, and do not disable its named controls. First/last name, email, phone and message survive Continue→Back and remain in final native FormData on step two. Set `noValidate` and explicitly validate step-one controls before Continue; on Enter from step one, prevent submit and run the same transition. Final Send/Enter first checks step-one controls, reveals their step before reportValidity/focus if needed, then checks visible required consent controls. Only a valid final submission reaches the existing portal submit handler. Do not duplicate payload fields or bypass the real portal event contract. Keep values on error and reset only on genuine success. Test an invalid retained first-step value from step two so “invalid form control is not focusable” cannot occur. Verify final payload through non-delivery interception including unchanged names, consent and UTM. Visible copy: Step 1 “Your details”; Step 2 “How we can contact you”; no response-time claim.

Plan interest is a public-only enhancement: links carry the encoded actual published plan name in `plan`; validate that value against current published catalogue names before using it. Add a visible selected-plan line and prefill the existing `message` textarea with a short editable “I’m interested in [plan name].” message. Never overwrite a nonempty draft; append a distinct plan-interest line only if absent. Do not add a new payload field, hidden required selection or API change. Unknown/stale plan query falls back to generic enquiry rather than claiming availability. Any visible new interest remains editable in the message and is included in captured FormData. No contact fields or enquiry draft goes into storage.

## 6. Classes `/classes`

Compact chalk editorial intro, H1 “Find your class.” Body: “Beginner or experienced, adult or younger student—explore the classes at Attic and ask us where to start.” Direct in-page “View timetable” and Start training actions. This is a task page: the timetable should appear within the first desktop screen or close to it, not after a long atmosphere story.

Before the timetable, a short two-column explainer: “Gi” and “No-gi” in plain language, plus a link to beginner help. Then `#live-schedule`: existing read-only catalogue/getTimetable output. Group by **Europe/Dublin local date keys**, not `starts_at.slice(0,10)`; format date headings and hours in that same timezone while keeping source timestamps unchanged. Include an isolated UTC-overnight/Irish summer-time fixture and DST-adjacent date in verification; no protected library change. Desktop two date columns maximum; rows contain time, name, duration and real coach only when provided. Mobile date stacks with time in a stable 75–90px column. No capacity claims or booking actions added to the public table.

State copy: no published sessions → “The next class times aren’t listed here yet. Contact the academy for the current timetable.” If upstream fallback is being used, do not label it “live”. Catalogue failure must not take down the entire page; preserve the existing server helper’s semantics and provide contact where supported, without editing the helper.

Below schedule, full catalogue class descriptions grouped meaningfully into beginners/adults/youth where classification is reliable. Unknown classes stay in “More training” rather than disappearing. Native section anchors supply the home routes. Youth copy may show the live site’s kids 6–11/teens 12–15 only if current class data does not contradict it; otherwise omit hard ages and ask the team. Conclude with enquiry plus Members link for existing students. Existing booking app is only linked, never embedded/rebuilt.

## 7. Memberships `/memberships`

H1 “Make training part of your week.” Intro: “Beginner programmes, adult memberships and options for younger students and families.” Left aligned short intro. A small jump navigation lists only nonempty groups using actual catalogue audience labels. `#live-plans` remains.

Use structured editorial pricing rows instead of a three-column SaaS pricing grid. A beginner programme may receive a broad red-edge feature panel when actually present; all other plans use two-column desktop rows: name/detail on left, price/term/action on right. Mobile stacks name, clear cost, full detail and “Ask about this plan” → `/?plan=URL_ENCODED_PUBLISHED_NAME#trial-form`. Every row uses its actual displayed published name; no static slug substitution or fuzzy choice. The visible editable message prefill described above carries context through the existing message field. No API/payload schema/required-field change. Never trim important usage limits, split price text into a false monthly denomination or omit periods. Preserve catalogue strings and explain terms only when supplied.

Show all published plans including unexpected audience groups; filter empty groups. No invented most-popular labels, saving calculations, crossed-out prices or checkout buttons. Footer note: “Memberships and payments are arranged with the academy. Contact us to confirm eligibility, family coverage and your start date.” Keep `#member-area` and present “Already a member?” plus `/members` link clearly. This alters public access presentation only.

No plans state: “Contact the academy for current memberships and pricing.” Show phone/enquiry, no empty category frames or static stale replacement prices.

## 8. About `/about-us`

H1 “Good coaching. A welcoming room.” Split introduction and wide actual training image. Explain Attic as a Carlow academy for beginners and ongoing students, without the unsupported exclusivity claim. Use a short “How we train” section of three ruled paragraphs, not generic value cards: technical instruction, training partners, adult/youth routes. Avoid promising outcomes.

Large Darren and Brian profile sections alternate 5/7 and 7/5, photo then factual biography. Timeline facts may say each began training in 2009 and Brian’s black belt in 2022; do not invent Attic’s founding date or expand competition claims. Omit inconsistent lineage spelling. A clear “Explore classes” follows coach proof. Final location/enquiry strip repeats full address, phone, Start training. No second full form needed.

## 9. Gallery `/gallery`

H1 “Life on the mats.” Intro: “Training partners, technical details and coaching at Attic in Carlow.” Ship the complete unfiltered gallery; existing metadata is unsafe because gallery-4 visibly shows gi clothing despite its No-Gi label. Use a page-local mapping of visually checked neutral captions, never edit protected site-data. Every caption/alt must agree with the visible activity. Desktop two-column editorial grid with alternating 4:3 and 3:2 crops, every fourth image spanning full width; mobile single column. Preserve credits and captions. Do not use dense tiny thumbnails beside a giant active image that pushes half the gallery off-screen.

Optional image modal is a native dialog with visible Close, previous/next controls, image counter, caption, arrow-key support, Escape, focus management and focus return to trigger. Full image uses contain, so embedded credits remain visible. Thumbnail markup is a native anchor to the full-size image; prevent default only after the enhancement is ready, so no-JS/script failure remains a complete linked gallery. No filtering or empty-category state is required. Final Start training action is concise.

## 10. Motion specification

| Element | Trigger and sequence | Duration/easing | Fallback and guardrail |
|---|---|---|---|
| Hero headline | On first page mount, 12px translate to rest; two text blocks follow with 80ms offsets | 680ms, cubic-bezier(.16,1,.3,1), total under 900ms | Server HTML visible. Do not initially opacity:0 essential text. Reduced motion: no transforms/entrance. |
| Hero image | On mount, scale 1.045→1 and optional 14px translation | 850ms same ease, starts 60ms | Image area reserved; image and CTA are never waiting for a loader. |
| Mat-edge rule | Hero once, scaleX .85→1 from left | 600ms, begins 150ms | Decorative only; static under reduced motion. |
| Programme row | Hover/focus arrow +4px and underline | 180ms ease-out | Keyboard sees focus independently. No pointer-following movement. |
| Main CTA | Hover background darkens, arrow +3px; active scale .985 | 180ms / 80ms | Focus ring stable; only control responds, no magnetic cursor. |
| Photo composition | Desktop ≥1080px/fine pointer; one main gallery-10 image, section entry→exit | Named native CSS view timeline, translateY(18px)→(-18px), inner image 40px overscan; second photo static | `@supports` gate; static unsupported/mobile/coarse/reduced motion. Caption/credit static outside moving layer. No scroll listener/rAF fallback. |
| Menu disclosure | Panel opacity/translateY 6px | 180–220ms | Nav readable without transition; no height animation or delayed links. |
| FAQ | Native immediate opening, marker rotates to minus | 160ms | No animated auto-height. Essential answer appears instantly. |
| Gallery grid | No automatic entry/filter choreography | Static | Linked images remain useful without JS. |
| Gallery modal | Dialog opacity and image scale .985→1 | 180ms | Full control available immediately, reduced motion instant. |
| Form step | Update then focus step heading, no whole-form jumping animation | 140ms opacity only | Validation first; hidden step never traps invalid required fields. |

Do not animate every section. Coach profiles and timetable remain still. No autoplay, perpetual breathing dots, typewriters, text scrambling, cursor replacement, audio, 3D loading scene or route transition that delays reading. Native transitions provide advanced compositional confidence without importing a motion library for its own sake.

## 11. Component and technical plan

Dependencies checked: Next 16.2.0, React/React DOM 19.2.4, Tailwind 4. No motion, GSAP, icon or component library exists. Proposed motion uses CSS keyframes and one CSS view timeline, with no JS scroll controller and no new dependency. Optional gallery/menu/form remain isolated client leaves. No unverified import paths.

Before writing Next code, read the installed relevant Next 16 docs, especially App Router server/client boundaries, CSS and Image/Link. Public pages remain Server Components; tiny client leaves own mobile nav, optional gallery and existing enquiry UI. Add `.website-shell` in `(website)/layout.tsx` and import a route-group stylesheet with every selector scoped below it. Inherited root/global fonts remain intact. Explicitly reset prior public pill/radius/gradient styles under this scope rather than editing global definitions. Root layout and globals stay byte-identical.

Possible public components: `AcademyHero`, `ProgrammeLinks`, `PlanRows`, `CoachProfile`, `PublicTimetable`, `AcademyGallery`, `PublicAttribution`. Keep copy local to marketing pages/components because `src/lib/**` is protected. Consume catalogue and static constants read-only. Keep tracker script, schema and hidden form attribution. A small public-only client leaf captures supported UTM query parameters on each public entry/navigation into sessionStorage; an explicit whitelist stores only utm_source, utm_medium, utm_campaign, utm_content and utm_term, never names, email, phone, message, plan draft or arbitrary query parameters. Populate existing differently-cased hidden UTM field names from current query when present, otherwise the session attribution snapshot; current explicit campaign parameters take precedence by a documented consistent rule. Existing CID/Submission URL semantics remain handled by the integration, not replaced with a new identifier. Guard storage failure with try/catch and preserve current-query capture. No protected tracker/library edit or new analytics service. Do not accidentally create a full-site client tree.

Protected: `src/app/members/**`, all APIs, `src/components/members/**`, member portal, `src/lib/**`, `src/generated/**`, `public/members/**` and member scripts. Root can hash these before and after, including root layout/globals, and compare no change. Do not run sync scripts or mutate catalogue data to make a marketing layout easier.

## 12. States, accessibility and verification

- All actions have text names. No decorative arrows announced by assistive technology. Maintain one H1, ordered headings and explicit landmarks.
- Reserve image dimensions and use accurate sizes. Local Next 16 image docs inspected: `priority` is deprecated; choose documented `preload` only for the single clear LCP hero, or eager/high-fetch-priority guidance as appropriate, never combine competing preload/loading/fetchPriority strategies. Use one responsive image, not separate preloaded desktop/mobile sources. Lazy-load below-fold images; never preload the gallery.
- Forms: labels above fields, required fields marked, helper/error below, autocomplete, focus first invalid input. Errors must be associated with inputs; general status is live. Keep input values on failed submit. Show Sending state on the button and prevent duplicate submissions. Success says enquiry sent and class still needs confirmation. Optional marketing is off by default. Keep existing contract intact.
- Catalogue empty/error paths still give a clear next action, and no empty group headings. Avoid “live” where freshness cannot be established.
- Header/menu keyboard and no-JS tests; FAQ keyboard test; modal keyboard/screen-reader/focus return test. At 200% zoom content remains reachable and sticky header does not hide anchors. Gallery captions must be checked against actual photos, not inherited metadata.
- Verify at 320, 390, 768, 1024, **1366×768** and 1440×900. The short desktop test includes actual header, real headline wrap, both hero actions and credit caption. No horizontal scroll; contrast, 44–48px targets, no full-image credit clipping; long real plan titles/prices wrap without breaking alignment.
- Test reduced motion, JavaScript disabled, slow image loading, no timetable entries, no beginner plan and missing price fields through safe read-only fixtures/inspection, never by editing business data.
- Run lint and production build, then browser inspect every public route plus `/members` for preserved appearance/navigation. Test Home→Members and Classes→Members after stylesheet load because unchanged member file hashes do not catch global CSS leakage. Every selector/reset/media rule stays below `.website-shell`; no global body/html/:root/button rules. Confirm enquiry fields survive step switching and final non-delivery FormData contains details/consent/attribution. Exercise Enter on both steps, invalid hidden details, Back, error retry and optional marketing unchecked. Test `/classes?utm_source=instagram&utm_campaign=beginner#beginners` → Memberships → a real contextual plan enquiry → captured FormData; original campaign and chosen editable plan message must survive. Do not submit production leads.

Verification is finite: one whole-site responsive/state inspection batch, one consolidated fix batch, then one confirming browser batch. Include the listed widths and targeted states within those batches rather than endless separate polish loops. The final requested three-agent implementation review is a separate evaluation; correct material defects it identifies without restarting design critique rounds.

### Acquisition paths and honest measurement

This is a build recommendation, not campaign execution. Beginner education/social → `/classes#beginners` or stable `/#beginner-programme`; parent content → `/classes#youth`; ongoing-training content → `/classes#live-schedule`; membership comparison → `/memberships#live-plans`. Existing UTM fields remain exactly named, supplemented by the session-only public attribution capture above so ordinary browsing does not lose the entry campaign. Prove the complete entry→browse→plan→enquiry path through non-delivery FormData; unchanged hidden fields alone are insufficient evidence. Track action intent separately from successful enquiry, then confirmed attendance/membership within the established business process. No active ad spend, conversion improvement or response-time claim is established by research.

## 13. Risks and choices to challenge in peer review

1. The confident black-and-white style could feel intimidating. Counter with readable bright sections, plain beginner copy and real coaching imagery rather than aggression.
2. Asymmetric crop choices can hide faces or photographer credits. Require visual review per breakpoint and full-image modal containment.
3. Catalogue metadata may not classify beginner/youth reliably. Never discard unmatched entries or force invented labels; generic fallback route stays useful.
4. A two-step enquiry introduces friction; retain its integration schema/consent requirements while fixing mounted-field persistence, explicit pre-submit validation and contextual message/attribution reliability.
5. Native scroll timelines vary by browser. Treat them as enhancement; static composition must look equally deliberate.
6. An image-led gallery modal is additional complexity. If time constrains robust keyboard implementation, ship a strong static gallery with full-size image links rather than the current inaccessible overlay.
