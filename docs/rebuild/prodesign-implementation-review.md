# Pro Design implementation review

Reviewed 27 October 2026 against the **later user steering** in `build-brief.md` and `form-experience.md`: all-dark, no emojis, almost no arrows, full-width photographic carousel/parallax, more motion and a new privacy page. The earlier chalk/split-portrait proposal is superseded. This is final implementation review, not a third design critique cycle. No source edits, browser mutations, extra servers or production submissions by this agent.

Evidence: current public page/components/CSS, and first-batch screenshots `hero-1440`, `home-1440`, `hero-390`, `home-390`, `classes-1440`, `memberships-1440`. Screenshots were inspected from the filesystem while root QA ran. Runtime behaviour findings below are code-derived; root should verify the corresponding interactions in its consolidated batch.

## What is working well

- **The updated visual direction is coherent.** Ink/charcoal layers, quiet off-white type and red actions satisfy the dark brief without losing separation between sections. The desktop hero is now full-width photography, the oversized Barlow headline remains readable, and the actual training scene is more immediate than a generic sports landing page.
- **The 390px hero is readable and actionable.** Both Start training and View timetable appear before the carousel controls. No headline clipping is visible in the supplied screenshot. Logo, Members and Menu remain legible. No emoji or decorative arrow clutter appears.
- **Membership presentation is particularly strong.** The screenshot shows readable editorial rows, actual billing periods, complete plan detail and distinct audience groups rather than arbitrary popularity badges. Prices remain data-derived; family coverage is not invented. Public member entry is clear.
- **Credibility comes from the actual academy.** Named portraits, concise training-history facts, real red mats and practical FAQ make the serious/welcoming positioning believable. The inclusive line stays beside supported adults/kids/teens text rather than becoming an unsupported universal eligibility promise.
- **The new guided enquiry is a useful application of the requested form skill.** Intent choices are real SVG/text buttons, personal fields remain mounted, required consent is separate from optional marketing, the privacy link is outside its checkbox label, parent details are requested for youth, and explicit noValidate validation prevents hidden-invalid native blocking. The synchronous step ref prevents a rapid repeated choice from advancing twice.
- **Public functionality has clear boundaries.** The Classes page groups using the new local-day helper rather than UTC prefix, catalogue helpers remain read-only, and Members is linked instead of rebuilt. Gallery uses native image links and native dialog with full-size contain, close/Escape and focus return. Website rules are predominantly shell-scoped, including conditional document overrides gated by shell existence.

## Prioritised findings for the single fix batch

### P1 — Preserve attribution when later public URLs contain only some campaign fields

Location: `src/components/public-attribution.tsx:19–29`, especially line 27.

The stored object is replaced with the current URL's nonempty fields. Example: arrive with `utm_source=instagram&utm_campaign=beginner`, then visit a public URL containing only `utm_content=coach-video`; session storage now contains only content, so a later generic enquiry loses source/campaign. The final plan explicitly requires current values to override matching keys while omitted keys retain session attribution. The effect also depends only on pathname, so a same-path query update is not captured for subsequent browsing.

Fix: merge whitelisted current values over `readAttribution()`, and respond to supported search-parameter changes as well as pathname. Keep storage session-only and no personal fields. Confirm via a non-delivery entry→partial-query→browse→plan→form payload test, including a same-path query change. This does not require tracker/lib/member edits.

### P2 — Pause currently stops slide changes but leaves photographic movement running

Locations: `src/components/hero-carousel.tsx:22–27,32–36`; `src/app/(website)/website.css:368`.

`running` gates the 7.5-second timeout, but the active slide's 8.5-second Ken Burns animation has no paused state/class. Clicking Pause, hovering or focusing the carousel therefore leaves the photograph visibly zooming until its animation finishes. That weakens the meaning of the visible Pause control and the stated pause-on-focus behaviour.

Fix: expose running/paused state on the carousel and apply `animation-play-state: paused` to the active photographic zoom whenever playback is suspended. Keep manual selection working and reduced motion static. No need to remove user-requested parallax; if Pause intentionally governs slide playback only, its label must make that scope clear, but pausing the autonomous zoom is the preferable behaviour. Verify immediately after a fresh slide change so the remaining zoom is observable.

### P2 — Validate selected-plan context against the current published catalogue

Location: `src/components/contact-form.tsx:61–65`; caller `src/app/(website)/page.tsx`.

The form appends any `?plan=` value to the visible message. Valid links work and typed text is preserved, but retired/arbitrary names are treated identically to current published plans. The final coordinated specification required an invalid/retired parameter to fall back to a normal enquiry. This is not an XSS finding: the value is assigned to textarea text, not HTML.

Fix: pass the allowed current names from the already-read Home catalogue into the client form as a serializable list, or equivalent public-only validation. Prefill only exact published names. Preserve existing append-without-overwrite behaviour and do not add hidden-only plan intent. Test a current name, invalid name and existing draft. No extra backend request or protected-data mutation is needed.

### P2 — Choose mobile focal points per hero photograph

Locations: `src/components/hero-carousel.tsx:5–8,33`; `src/app/(website)/website.css:446`; evidence `screenshots/one/hero-390.png`.

The supplied mobile screenshot of the technical-exchange slide shows mostly red wall and a cropped shoulder; the right participant's face is outside the visible frame. A single `object-position: 58% 50%` for all three wide source photographs is insufficient when the frame is tall. The headline remains excellent, but the user asked for a photographic hero and the mobile photograph should still communicate a person training.

Fix: set source-inspected per-slide mobile focal positions, retaining a face/meaningful training interaction in each manual slide at 390px and 320px. A darker scrim may remain behind the copy. Avoid enlarging the mobile hero or shrinking type to solve this. Inspect all three manual slides, not only the initial screenshot.

### P2 — Keep static location structured data in the server output

Location: `src/app/(website)/layout.tsx:36–41` (`attic-location-schema`).

The unchanged SportsActivityLocation object is now injected with `next/script` `afterInteractive`. That makes otherwise static structured data depend on hydration, whereas the previous plain JSON-LD script was server-rendered. The technical brief calls for server metadata/schema preservation and this data needs no client lifecycle.

Fix: render a normal server `<script type="application/ld+json">` for the serialized static schema, while leaving the actual external tracker script's lifecycle alone. Confirm it appears in initial HTML without JavaScript. This is a small public-layout correction.

## Nonblocking design feedback

- **Classes is useful but very long.** The supplied desktop capture presents approximately four weeks of upcoming days before programme guidance, creating a large schedule wall. Direct audience anchors mitigate this. A compact week jump or “show more dates” control could improve scanning later while preserving every source session; it is not required to complete this fix batch.
- **The same technical-exchange image appears in hero, starter offer and photo story.** It is a strong photograph, but repetition is noticeable in the full Home capture. Replacing one static occurrence with another verified original would add variety without changing the final architecture. This is optional polish, not a reason for another design round.
- **The mobile full-page rhythm is calm and cohesive, but some proof/metadata text is small.** The hero itself is strong. Root's actual-size mobile/zoom check should decide whether 10–11px strip and carousel labels need a modest increase; the highly downscaled full-page image alone cannot establish a readability failure.

## Verification limits and handoff

No production enquiry, ad, booking or payment was sent. This review does not independently prove external delivery, production availability, legal completeness of the new policy, or protected-file equality; root owns those evidence checks and has the hash baseline. The privacy page is present, dark-styled and linked from consent/footer, with business contact details and observable handling described rather than invented processor geographies or retention dates.

Recommendation: include the concrete attribution fix and justified P2 corrections in root's one consolidated batch, then one confirming browser round covering payload, carousel pause/manual mobile focal points, no-JS navigation/schema and public→Members style isolation. The new dark photographic direction should be retained.
