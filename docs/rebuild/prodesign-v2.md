# Pro Design build plan — v2 after peer critique round one

Date: 27 October 2026. Planning only; no source changes. Read `research.md` first, then the existing public pages, shared data interfaces, header, gallery and enquiry component. Applied `C:/Users/kyler/.codex/skills/PRO-DESIGN/SKILL.md`. The research's Art of Jiu Jitsu, Grange and New School observations satisfy the industry-pattern study; no additional inspiration sources were introduced. Directly read the [live homepage](https://www.atticbjj.net/) and [legacy story/class page](https://www.atticbjj.net/home-1) to corroborate local identity, coaches and ages. The memberships fetch timed out; displayed prices must come from the repository catalogue regardless.

## 1. Design thesis and evidence

**A serious training room with room for beginners.** The most characteristic thing is two people solving a physical problem on the mats, coached by named local people. Open with an authentic training photograph and a strong, short statement. Quiet editorial layouts then explain the practical decisions: which class, what membership includes, who teaches, where to go and what happens after asking.

### Round-one feedback change log

Accepted from both peers: merge the standalone first-visit section into the enquiry area; replace the unsupported “knows your name” headline with factual coaching language; make timetable access early and direct; retain actual public form values through steps and native final serialization; map acquisition audiences to specific destinations.

Accepted from Taste: commit to one specifically identified CSS scroll scene with bounded transforms and a static fallback; choose a stacked 4/8 route selector; formalise portrait crop and 1366×768 acceptance.

Accepted from Hormozi: do not imply plan context survives a generic anchor. Use “Ask about membership” for individual plan actions and show a visible prompt to include a plan name in the existing message. No added plan prefill/query mechanism in this version: the honest generic-action alternative in the feedback satisfies the need without adding another public state flow. This is a deliberate implementation choice, not a claim that prefill is forbidden.

Retained with qualification: “A place for everyone” is supported by Attic's published family-friendly/everyone positioning, but the same screen immediately specifies adults, kids and teens. It must never become “every age”, “all medical needs”, universal suitability or an accessibility guarantee. Pro Design's existing exact typography and protected-route boundaries remain.

Keep the existing Attic badge, red/ink/chalk identity, Barlow Condensed and Source Sans 3. This is already an evidenced brand, so the Pro Design instruction to invent and approve a new brand sheet does not apply. The deliverable is a clearer expression of the existing identity. The root's research determines the scope and all commercial claims.

Transferred patterns, not copied identities:

- Art of Jiu Jitsu: visible adult/youth routes and specific equipment inclusion.
- Grange: welcoming first-class explanation beside named coaching evidence and local visit details.
- New School: suitable class before timetable, distinct existing-member entrance.
- Third Space/Soho House: membership value made tangible and public discovery separated from routine member tasks.
- basement/Lusion research: one choreographed opening, layered photograph movement and conventional navigation, with no dependence on motion for comprehension.

Do not call Attic Carlow's only academy, promise a free class, invent reviews, invent campaign results, claim guaranteed fitness or self-defence outcomes, or add scarcity. Published Wix copy establishes family-friendly training; it does not establish those extra claims.

## 2. Brand system

Declare every colour, font role, size, space, stroke and timing in CSS variables on `.website-shell`. Components consume variables. Do not edit root globals or root layout. Prefix every new selector with `.website-shell`, including media overrides, because route-group CSS can remain loaded after navigation.

| Token/role | Proposed value | Use and constraint |
| --- | --- | --- |
| Attic red | `#c43148` | Primary action fill, active rule, tiny wayfinding mark; established project colour. |
| Ink | `#0f0c0d` | Hero/header/footer background, dark text on chalk. |
| Chalk | `#f7f3f1` | Open reading sections, text on ink. |
| Graphite | `#292326` | Quiet secondary dark surface where distinction is needed. |
| Warm grey | `#bdb3b7` | Secondary text on ink only; verify 4.5:1. |
| Stone | `#6c6065` | Secondary text on chalk only; verify 4.5:1. |

White on red must pass AA for the actual button text size; test rather than assuming. Red is not small text on dark backgrounds: use chalk labels with a red rule for active navigation. Use an ink or chalk offset outline for focus according to the surface, so focus remains visible on red.

Heading family: inherited `var(--font-heading)` = Barlow Condensed, weight 600/700, uppercase for short display only, tracking 0.005–0.025em. Body: inherited `var(--font-body)` = Source Sans 3, regular/600. Body 18px desktop, 17px mobile, line height 1.55–1.65; FAQ/metadata minimum 15px. Reading width 58–65 characters. H1 clamp approximately 56–104px desktop; home has four short lines at most. Mobile H1 48–60px with natural wrapping, no character-by-character splitting. Inner H1 48–80px; H2 38–60px; H3 26–34px.

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 80, 112px; select via named variables. Desktop content max 1320px, page gutter 40–60px at 1440; tablet 28px; phone 20px. Section padding 88–112px desktop and 48–64px phone. Borders 1px; panel corners 0–4px, inputs 4px, round shapes reserved for the actual round logo. No card shadows, coloured haze, repeated badges or gratuitous rounded chips.

Signature element: a **mat boundary** — a solid red rule meeting a perpendicular short rule at the edge of the hero photograph. Repeat sparingly as section index or current state, never around every item. The red line has a functional role in locating the action or active audience. No fake belt-rank badge.

Voice: direct, knowledgeable and welcoming, with the calm of a coach explaining the next step. Avoid warrior, elite-only, life-changing, intimidating combat slogans and vague transformational promises.

## 3. Shared navigation and page frame

Desktop header: badge and two-line Attic/Carlow wordmark at left; Classes, Memberships, About, Gallery centrally; Members text link and red Start training button at right. Home remains logo destination and appears in mobile/footer navigation. “Timetable” is a direct text link in desktop and expanded mobile navigation and the hero secondary CTA; avoid a second competing header button. Test fit and collapse before crowding. Existing-member destination is `/members`, not the old memberships anchor.

Header height 80px desktop, 72px mobile. Sticky opaque ink surface; a slim bottom rule may appear after scrolling. No large backdrop blur. Active link uses `aria-current="page"`, chalk text and red underline. Provide Skip to content. Main receives stable `id` and focus destination. Anchor offsets account for header height plus 16px.

Phone/tablet menu collapses before links become crowded (approximately 1080px, based on actual fit). Real button has `aria-expanded`, `aria-controls`, clear Menu/Close label and minimum 44px target. Use an inline expanded panel below the header rather than a full-screen takeover: regular flow, links remain visible, no focus trap required. Escape closes; close on navigation; return focus to toggle when closing via Escape. With JavaScript disabled, public navigation must remain discoverable, preferably native disclosure fallback or a noscript link list. Do not allow mobile body overflow to hide an unusable menu.

Footer: logo, short line “Brazilian jiu jitsu in Carlow.”; all existing public route links; `/members`; full address; tel and email; Instagram/Facebook. Social links describe destination. No newsletter or invented legal-policy routes. The homepage holds the enquiry form and every page has one final link to it. Keep all current anchors: `/#trial-form`, `/classes#live-schedule`, `/memberships#live-plans`, `/memberships#member-area`.

## 4. Home architecture, copy and layouts

### A. Hero — photograph-led, split composition

At 1440, ink block takes 54% and tall portrait photograph 46%, header excluded; content frame 1320px. Photograph uses `hero-live.jpeg` because it depicts real stand-up movement and naturally supports a portrait composition; `hero.jpg` is a logo image, so it must not become the training hero. Text and CTAs sit on solid ink, never over a busy face. A narrow red edge marks where image and text meet. Portrait image frame uses 3:4 and initial `object-position: 50% 50%`; inspect original before changing that crop. Both faces and connected arm positions must remain visible; credit goes into a verified adjacent caption whenever the frame crops its original position. Home hero has content-driven height, approximately 620–680px, not a fixed minimum. Headline and both actions must fit at 1366×768 and 1440×900; reduce padding/type or photo height before sacrificing action visibility. Do not force full viewport height.

Exact visible content:

Small location line: “BRAZILIAN JIU JITSU · CARLOW”

H1: “Serious jiu jitsu. A place for everyone.”

Body: “Beginner-friendly training for adults, kids and teens. Learn with experienced coaches, train gi and no-gi, and find your place on the mats.”

Primary: “Start training” → `/#trial-form`.

Secondary: “View timetable” → `/classes#live-schedule`.

Under-action reassurance: “New to jiu jitsu? We’ll help you choose your first class.”

At 390, location + H1 + body + stacked/wrapping action row precede photograph; type should consume roughly 350–430px. Use a near-portrait 4:5 photo frame, initial `object-position: 50% 50%`; retain both faces/connected arms and show the exact original credit immediately below whenever the original credit is cropped. The photo can extend below the fold because the action is already visible. Do not compress portrait training into a wide crop to force the entire hero onto one mobile screen. Main CTA stays visible without scrolling a huge image. On very short screens, natural content flow wins. Do not invent a credit or assume permission to remove it.

### B. Compact evidence strip — quiet facts, not vanity statistics

Immediately below hero: three short equal columns with separators: “Coaches training since 2009”; “Adults, kids & teens”; “Gi & no-gi”. On phone, wrap into a simple list/grid with no horizontal scrolling. The 2009 fact refers to coaches' training, not academy founding. No counters or animated numbers.

### C. Choose your route — three open editorial rows/cards

Chalk section, headline “There’s a class to start with.” Choose a deliberate 4/8 desktop editorial layout: heading/short intro on the left four columns; three stacked full-width route links on the right eight columns, divided by top rules, with red arrow at far edge. Mobile stacks heading then the same rows. Routes are alternatives, so do not number them. No image per audience: the existing set lacks verified youth-class photography. Generous space, a clear full-row link and text hierarchy provide distinction without identical feature cards.

- “New to jiu jitsu” / “Start with the fundamentals. Ask us about a beginner class and what to bring.” → `/classes#beginners`.
- “Already training” / “Explore gi, no-gi, mixed-level classes and open mat.” → `/classes#live-schedule`.
- “Kids & teens” / “Age-specific classes, clear coaching and a welcoming place to learn.” → `/classes#youth`. State ages 6–11 and 12–15 in the detail page if current class records do not contradict them, not every home card.

Native links, not a questionnaire or hidden tab. With no JavaScript, all choices work. Keep entire route element clickable without nesting links.

### D. Beginner offer — concrete catalogue panel

Wide ink horizontal panel on chalk: left heading “A clear way to begin.”, two short lines about a structured start; right a large readable actual catalogue plan name, price with billing/validity term, inclusions, and “Ask about the beginner programme”. The adult beginner plan is selected by known catalogue ID/slug verified during implementation, not by fuzzy matching the cheapest price. Render source price and description with existing helper; never type the research's €160 directly into JSX. Display kit only if current plan description confirms kit. Do not attach a crossed-out price, best-value badge, savings percentage or no-risk guarantee.

If no current beginner plan is published: replace offer contents with “Ask us about getting started” and enquiry link; show no stale price. If a price is unavailable, preserve helper's enquiry fallback. Offer action leads to the contact form; it does not buy, reserve or book anything.

### E. Coach proof — faces and verified specifics

Ink section; heading “Meet the people teaching you.” Two portraits, each beside a short text column rather than another shadowed card. Darren: “Darren Curtis — Head Coach. Training since 2009, Darren brings black belt experience and years on the competition mats.” Brian: “Brian Connolly — Coach. Training since 2009 and a black belt since 2022, Brian brings experience coaching kids and teens.” Link “Meet the coaches” → `/about-us`. Avoid the inconsistent lineage spelling; do not rewrite shared `site-data.ts`. Coaching proof follows the offer directly, with no intervening standalone first-visit section.

### F. Life on the mats — single photo essay

Two unequal photographs at 7:5 and 4:5 proportions with a short caption below; use `gallery-10.jpg` for visible coaching discussion and `gallery-9.jpg` for training, subject to full-resolution inspection. Heading “Learn the details. Put them into practice.” Supporting copy “Technique, training partners and time on the mats. Take a look inside Attic.” Link “Inside the academy” → `/gallery`. Keep these original colour photographs to let the real red mats supply brand colour. Hero/coach assets retain their existing monochrome appearance; no global grayscale or red filters. `gallery-10` is the only scroll-moving photo; `gallery-9`, heading and link stay still. Exact scene specified below.

### G. First-class questions — native FAQ

Chalk, narrow reading column; 5 native details/summary rows divided by rules. Questions: Can a complete beginner join? Do I need to be fit first? What should I bring? What is gi and no-gi? What ages are kids and teens? Sample answer for kit: “Ask the team what to bring for the class you choose. Selected beginner plans include training equipment; check the plan details.” Gi answer: “Gi classes use a training uniform. No-gi classes train without the gi. The team can help you choose a suitable class.” Do not introduce specific unverified hygiene, safeguarding, parent attendance or medical rules.

### H. Visit and enquiry — the destination, not another promotion

Ink two-column layout. Left: H2 “Your first class starts with a conversation.” Body “Tell us who will be training, your experience and anything you’d like to ask. The team can help you find a suitable class.” A compact three-line ordered summary belongs here, not in another full-width section: 1. Tell us who’s training. 2. Choose a suitable session with the team. 3. Come and train once arrangements are confirmed. Follow with “An enquiry does not reserve a class place.” No response-time claim. Full address, phone/email links, “Open directions” link using encoded verified address. No map embed required; no invented parking/transit advice. Right: existing enquiry form, with its submitted field names, tracking attributes, portal events, consent semantics and UTM fields preserved. The existing message prompt includes “If you’re asking about membership, include the plan name.”

Improve visible form headings to “Tell us about your training” and “How we can contact you”; avoid trivialising consent as “boring GDPR stuff”. Step one button “Continue”; step two “Send enquiry”. Add persistent short “This is an enquiry, not a confirmed class booking.” Text must describe actual submission semantics. Success: “Thanks. Your enquiry has been sent. The team will contact you about the next step.” Never show “Your class is booked.” Preserve values on error; error includes call link. One form only; no duplicate IDs.

## 5. Classes and timetable `/classes`

Different job from Home: explain eligibility and provide actual schedule. Compact split hero, H1 “Find your class. Make time to train.” Body “Beginner, mixed-level, gi and no-gi training for adults, with dedicated kids and teens classes.” CTA “View timetable” anchored to retained `live-schedule`; secondary “Ask which class is right”. No full-screen opening.

Between intro and timetable allow only a two-sentence gi/no-gi explanation and compact anchor links “Beginners”, “Adults”, “Kids & teens”. No multi-row programme overview delays the schedule. Detailed open sections with stable `beginners`, `adults`, `youth` IDs follow the timetable so Home routes can land on the right explanation directly. Ages 6–11/12–15 come from live class names and must be omitted if current catalogue contradicts them. Do not assert adults may book every mixed/open session or that all sessions are suitable for beginners. Ask the team when eligibility is unclear. No new private/women-only programme without catalogue evidence.

Timetable follows, with all existing getGymCatalogue/getTimetable data behaviour unchanged. “Upcoming classes” and visible “Times shown for Carlow, Ireland.” Group by local day and preserve actual start/end/duration. Desktop 2–3 day columns; phone one day list, no squeezed week table and no sideways schedule scrolling. Each entry: time, class name, duration where supplied; no fabricated availability badges. Add “Members: book through your member area” → `/members`. New visitors get “Ask about a class”. Do not wire a new booking action.

If no upcoming sessions, show “Contact the team for upcoming class times and help choosing your first session.” Never show an empty grid. If data fetch errors, use the current read-only fallback policy; do not invent a server retry contract or edit library internals. Calendar should not render past events or fixed dates manually. Full catalogue listing after timetable preserves all classes, with clear heading “Class types” and source descriptions. An isolated display correction for obvious typo is acceptable in public JSX; no data mutation.

Final narrow CTA: “Not sure where to start?” / “Ask the team”. Header and footer preserve immediate member access.

## 6. Memberships `/memberships`

H1 “Memberships that fit your training.” Body “Explore beginner programmes, ongoing training and family options. We’ll help you choose the right fit.” One “Ask about membership” action and text “See the timetable”.

Keep `live-plans`. Render catalogue plans, group by actual published audience without losing unknown categories. Use anchor links to audience group headings instead of a JS filter hiding content. Prefer editorial ruled rows within each category: name/full description on the left; source price with original billing basis and action on the right. On phone stack name, full price/period, description and action. Every plan has “Ask about membership” linking to the existing form, with helper “Include this plan’s name in your message.” This generic wording accurately reflects a shared form without pretending plan context is prefilled. Do not imply checkout or immediate activation. No “most popular” designation without evidence. Show all public plan options; avoid duplicating two teaser pricing grids above the real list.

A short explanatory footer beneath plans: “Memberships and payments are arranged with the academy. Ask us to confirm eligibility, family coverage and your start date.” Do not infer cancellation policy, contract length, recurring billing or full-family unlimited coverage from a short name. Empty state says “Contact us for current membership options.”

Retain `member-area` as a useful bridge: “Already a member?” / “View your membership and manage class bookings in your member area.” Button `/members`. Preserve the actual member implementation entirely. This replaces the misleading existing public section that only asks members to telephone, without altering their booking workflow.

## 7. About `/about-us`

H1 “Good coaching. A welcoming room.” Body “Attic brings adults, kids and teens together to learn Brazilian jiu jitsu in Carlow.” Two-column genuine team training image with a caption, not stock wellness imagery.

Story section: describe the academy through coaching, beginner/mixed/youth training and community. Do not date its founding to 2009; that is the coaches' training history. Two full coach profiles use portraits and verified biography details; avoid embellishing ranks, medals or “Ireland’s most decorated” borrowed lineage claim. Include Brian's coaching since 2016 only if checked from live text, but the home version need not include it. Short youth subsection explains ages and that questions can be sent by a parent/guardian; do not create an unverified supervision policy.

Finish with full address, call/email and “Plan your first class” contact link. Links to Classes and Gallery are in context. This page carries factual story; no repeated Home offer/FAQ stack.

## 8. Gallery `/gallery`

H1 “Inside Attic.” Body “A look at the training, the coaching and the people on the mats in Carlow.” Photograph-first grid with asymmetrical wide/portrait rhythm on desktop, two columns tablet, one column phone where credit and detail need space. Render original images, preserve credits, avoid a 420px minimum-featured tile above many tiny duplicates.

Existing categories in `site-data.ts` contain inaccuracies: `gallery-4.jpg` is labelled no-gi but visibly shows gi training. Do not propagate unsupported category labels. Prefer a simple full gallery with visually verified neutral captions (“Training on the mats”, “Coaching between rounds”), or build a page-local mapping only after inspecting originals. No invented children in photos. No carousel autoplay.

Click opens an accessible native dialog/lightbox containing the complete uncropped photograph and caption. Label dialog; close button stays in viewport, Escape closes, focus returns to invoking thumbnail, background is inert while open. Arrow buttons with names and arrow keys move through photos if implemented; announce position “3 of 12” politely. Touch swipe is optional and must not be the sole control. With no JS, link each thumbnail directly to the image file. Image errors keep caption and a usable “Open photograph” link. Link “Come and train with us” to enquiry, without claiming a free class.

## 9. Motion specification

One orchestrated opening on Home, not one per section. Use CSS/Web Animations in a small client island; server HTML contains all content already visible. Use ease-out (`cubic-bezier(.22,1,.36,1)`), defined as a token.

| Element | Trigger | Timing and movement | Fallback/accessibility |
| --- | --- | --- | --- |
| Hero photograph | Initial Home render once | 800ms scale 1.035→1; 0ms delay; clip container bounds. No opacity from zero. | Static original for reduced motion/mobile/unsupported animation. |
| H1 block | Initial render once | 700ms translateY 14→0, starts at 60ms. Animate whole phrases, no per-character DOM explosion. | Text always visible; no animation if tab restores mid-page. |
| Supporting text/actions | Initial render once | 600ms translateY 8→0, delay 140ms. Entire sequence finishes under 900ms. | Action clickable from first paint; reduced motion has no transform. |
| Mat-boundary rule | Same opening | 700ms scaleY .7→1 aligned to image edge, 80ms delay. | Static rule. Decorative aria-hidden. |
| Training-life photo scene | Only Home section F; desktop ≥1080px, fine pointer, reduced-motion false, supported CSS scroll timeline | `gallery-10` frame owns a named view timeline. Animate inner image translateY +18px→−18px from section entry at viewport bottom (`entry 0%`) to section exit at viewport top (`exit 100%`), linear and bounded. Inner image has 40px vertical overscan; frame/caption position stays fixed. No scale or pinning. `gallery-9`, copy and CTA are static. | Use `@supports (animation-timeline: view())` plus media gates. Unsupported browser/mobile/reduced motion: same frame with static centred image. Credit is outside moving layer. No JS scroll fallback. |
| Navigation/links | Hover/focus | Underline scaleX 0→1 over 180ms; arrow translateX 3px over 180ms. | Focus ring immediate; no movement for reduced motion. |
| Buttons | Hover/press | Fill/border 180ms; press no more than 1px. | No layout shift, no card-wide bounce. |
| Mobile menu | Toggle | 200ms opacity and small clip reveal on already in-flow content. | Instant with reduced motion. No delayed navigation. |
| FAQ | Native summary toggle | Plus rotation 180ms; content appears immediately; optional opacity 150ms only. | Native open state works without JS; no height animation required. |
| Form step | Valid Continue/Back | 180ms opacity only. Focus new step heading; preserve fields. | Instant reduced motion; invalid field receives focus. |
| Gallery dialog | User click | 180ms backdrop/content opacity, optional 8px movement only desktop. | Instant reduced motion, Escape/focus guaranteed. |
| Gallery selection | Explicit arrow | 180ms opacity while dimensions remain stable. | No autorotation, no scroll jumps. |

No infinite marquees, scroll hijacking, cursor replacement, audio, preloader, 3D library or section-by-section fade train. Motion is appropriate athletic pacing, not a browser capability demo. The photo scene uses CSS only, with a deliberate static equivalent, not an optional custom animation engine. Any hero Web Animations enhancement cancels animations on cleanup. CSS media queries respect live preference changes; any JS also listens for them. No smooth scrolling under reduced motion. Disable transforms when keyboard-focused content might move unexpectedly.

## 10. UX states and accessibility acceptance

- Enquiry: idle, validation errors, step one/step two, submitting (disable repeated submit and say Sending…), server success, server error. Feedback `role="status"` or polite live region; error has clear association and retained values. Required consent distinct from optional marketing. Native visible checkboxes and focus treatment must not disappear inside decorative cards. Preserve exact existing field/event contract and no new backend. Fix the existing conditional-unmount issue explicitly: keep step-one inputs mounted in a hidden/inert inactive wrapper, with state-backed values if necessary, so native final FormData includes first_name, last_name, email, phone and message. Back retains values. Validate step one before hiding it; inactive consent fields must not block Continue. On final submit ensure all required data is valid and focus first actionable invalid field, revealing its step when necessary. Test captured outgoing payload without delivery; field names alone are not sufficient.
- Menu: open/closed/active route; keyboard and touch paths; link text stays visible at 200% zoom. Sticky header must not cover headings/focus.
- Plans/schedule: populated, zero items, unknown category, missing price/description. No empty audience heading. Do not use colour alone for audience or state.
- Images: correct alt for meaningful photos, empty alt for redundant decorative crops, human name for portrait; logos describe destination rather than repeating “logo” unnecessarily. Use aspect-ratio boxes to prevent shifts and real responsive sizes.
- Landmarks, one H1 per page, correctly nested headings, unique IDs, useful link names. Keyboard focus visible on ink/chalk/red; touch target ≥44px; text contrast ≥4.5:1 and large text/UI ≥3:1 as applicable. At 320px and 200% zoom no horizontal scroll except genuinely necessary content (none planned). At 390px no clipped Barlow line; do not set `white-space: nowrap` on main headings.
- No hidden essential content waiting on JS. Contact form itself uses existing JS contract; provide explicit phone/email nearby as a usable fallback. Nonessential motion should not appear in accessibility tree.

## 11. Technical build boundary

Only `src/app/(website)/**` and public marketing components are editable. Add `.website-shell` wrapper in its layout and a dedicated website stylesheet/module. Keep root `src/app/layout.tsx` and `src/app/globals.css` byte-for-byte, plus every member/API/lib/generated path and `public/members/**`. Do not alter dependencies or generated catalogue to obtain an easier design. Public image assets remain originals.

Reuse `getGymCatalogue`, `getTimetable`, `getClassCards`, `getMembershipCards` read-only with their existing dynamic behaviour. Server pages stay server-rendered; client islands only navigation disclosure, form, gallery and optional motion controller. Do not pass nonserializable callbacks from server to client. Shared data strings requiring revised copy are overridden in new page-local view models, never by editing `src/lib/**`.

Read local installed Next docs before implementation: `01-app/01-getting-started/11-css.md`, `03-api-reference/03-file-conventions/route-groups.md`, `03-api-reference/01-directives/use-client.md` and `03-api-reference/02-components/image.md` have been inspected for this plan. Important current detail: `priority` on Image is deprecated in this Next version; use documented `preload` only for a clear single LCP image, with correct `sizes`, and let the rest lazy-load. The CSS guide warns styles can persist across route navigation: scoping is necessary to protect Members. Do not add a second root layout for the route group.

Preserve Ingenium tracker placement, tracking script, data attributes, form slug, UTM field names and events. Change event labels to match actual visible CTA text when public copy changes; do not relabel an enquiry event as a confirmed booking conversion. Preserve existing metadata and SportsActivityLocation JSON-LD while keeping truthful route descriptions. Do not launch ads, send messages or change third-party settings.

## 12. Verification loop and delivery

Before edit: record protected-file hashes and repository status. Build complete public site, then one real-browser inspection batch at 1440px and 390px covering all five routes and existing-member navigation. Inspect 320px/200% zoom for fit as targeted checks. Also exercise keyboard navigation, menu, FAQ, form invalid/valid/error states and lightbox open/Escape/focus return. Mock only transport in isolated verification where needed; do not submit a real lead during testing or claim a mocked response verifies production delivery.

Run repository lint/build. Check console/errors, broken image loads, horizontal overflow, clipped headings, button contrast, visible focus, hero/CTA visible in initial screen (also 1366×768), source price parity, Dublin timezone and unchanged anchors. Navigate Home→Members and Classes→Members to detect CSS leakage. Confirm protected file hashes and no changes to booking logic. Measure hero image request, layout shifts and CSS timeline smoothness under a throttled mobile profile; static fallback is the intended result on mobile/unsupported browsers, not a missing effect. Check actual non-delivery FormData includes step-one fields on submit and that Back/error preserve values.

Fix all issues from that batch together, then one confirming browser round. Pro Design permits a maximum of two verification rounds; do not endlessly polish. Final peer implementation review requested by the user is a separate evaluation, not another design-plan iteration.

## 13. Main risks and explicit decisions

1. A wide full-bleed crop of portrait hero-live would remove bodies/credit. Use split portrait; verify credit in final layout and duplicate verified credit if required.
2. Source gallery labels are unreliable. Use inspected photographs and page-local truthful captions; do not change shared data.
3. Live catalogue can differ from Wix research and can be empty. Source data wins; offer panel has explicit non-price fallback.
4. This proposal is detailed but intentionally modest in client JavaScript. A cinematic opening and one CSS photo scene deliver distinctive motion; heavy 3D cannot justify its cost for local membership enquiries based on available evidence.
5. The current two-step form is longer than ideal, but its contract and consent semantics are established. Improve copy/focus and presentation without introducing new backend or deleting required fields.
6. Motion and short energetic headings must not obscure the practical information. Header action, class route, price terms and actual contact details are always readable.

## 14. Acquisition destination mapping

Proposals only, no campaign execution: beginner educational social/ad creative → `/classes#beginners` or the source-backed Home starter offer; parent content → `/classes#youth`; ongoing gi/no-gi training content → `/classes#live-schedule`; plan-comparison content → `/memberships#live-plans`. Add a stable Home starter-offer anchor only if used by the final build. Existing UTM capture remains intact. Report CTA interest separately from form-success events; confirmed attendance and membership are business-workflow outcomes and must not be inferred from web clicks. Unknown budgets, capacity and response time remain unknown.

Status: v2 complete after first critique/revision round. Wait for root to dispatch the second and final design critique round; no round-two critique initiated.
