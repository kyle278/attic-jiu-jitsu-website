# Taste critique — round two, final design critique

27 October 2026. Reviewed Pro Design v2 and Hormozi v2 only, using the existing shared evidence. No new research or source changes. This is the second and final design critique round; implementation review is separate.

## Pro Design v2

### Improvements worth retaining

- The 4/8 route selector is now a committed editorial composition and route options are correctly unnumbered.
- Offer→coach proof no longer has another large instructional interruption. The first-visit sequence is placed where the visitor actually acts.
- Motion is concrete: named source image, exact ±18px range, native timeline, 40px overscan, fixed caption and static fallback. This is the most implementation-ready scene across the plans.
- Early timetable, generic plan enquiry with an honest plan-name prompt, verified gallery captions and CSS leakage checks all resolve material round-one risks.
- Portrait crop requirements are now explicit, including bodies, credit and 1366×768 fit. The real red mats remain useful rather than being lost under blanket grayscale.
- Captured FormData and Back/error persistence are acceptance conditions, rather than assuming that unchanged field names prove a working form.

### Remaining changes before implementation

1. **P1 — Handle native validation before an invalid hidden field can block submit.** Keeping inactive step-one controls mounted fixes serialization, but browser native constraint validation happens before the submit event. A final `onSubmit` revalidation alone cannot reveal a hidden invalid field because the handler may never fire. Commit either to an `onInvalidCapture` path that reveals the relevant step and then focuses/report-validates after it is visible, or to controlled `noValidate` submission with explicit checks while preserving portal interception. Do not disable named first-step controls: that would drop them from FormData. Test a deliberately invalid retained step-one value from step two as well as the normal happy path.
2. **P2 — Choose the exact mobile no-JS navigation structure.** V2 still offers a button with “preferably native disclosure fallback or a noscript link list.” Pick native details/summary, or keep the existing button with a specific noscript list. Both are sound; leaving the choice implicit risks a nominal fallback that only works when JS already works. Acceptance is a 390px script-disabled browser with all public routes, timetable and Members reachable.
3. **P2 — Group calendar days by local time, not UTC string prefix.** Existing public code uses `starts_at.slice(0,10)` while formatting time for Dublin. The plan correctly says local day but does not explicitly replace that grouping key in public presentation. Use an `Intl.DateTimeFormat` date key in Europe/Dublin or a helper equivalent in the public page. Preserve source sessions/time values. Include a boundary test with a UTC date that falls on the next Dublin day in summer; do not alter server/catalogue logic.
4. **P2 — Keep the broad hero statement paired with precise routes in all responsive states.** V2 deliberately keeps “A place for everyone”, with a reasoned qualification. Ensure mobile does not visually detach the adults/kids/teens body text from that headline or hide it behind an animation/image. Keep it as welcoming positioning rather than a universal eligibility claim. No further copy change is necessary if the supported route context is present in the first text block.

No remaining composition or motion blocker beyond the validation mechanism. The plan is ready for synthesis after those small operational decisions.

## Hormozi v2

### Improvements worth retaining

- Stable “A clear way to begin” headline and exact source prose remove unsupported kit promises and stale parsed benefits.
- Neutral empty-schedule wording accurately describes missing listings without inventing internal confirmation activity.
- The hero now uses solid text ground, natural phrase wrapping, 320px checks and a credit-preserving portrait.
- Single CSS timeline/static fallback replaces the custom scroll engine. Public style leakage, form payload capture and current Next image guidance are now explicit.
- Complete unfiltered gallery with visual captions and progressive anchor interception is a simpler, more truthful design than the existing category interface.
- The primary beginner enquiry is appropriately direct; parent/experienced acquisition destinations and distinct measurement events remain clear.

### Remaining changes before implementation

1. **P1 — Resolve the still-contextual plan CTA.** Memberships still says “Ask about this plan”, with optional prefill if permitted and a plain anchor otherwise. That repeats the round-one ambiguity: a reader expects selected-plan context to survive, but the standard anchor carries none. Pick one implementation now. Easiest within this build: “Ask about membership” with visible “Include the plan name in your message.” If prefill is chosen, specify visible editable append-only behaviour and no overwriting an existing draft, then verify actual outgoing existing message field. Do not leave both as builder discretion.
2. **P1 — Final hidden-field native-validation mechanism needs an explicit path.** The revised form has the right data requirements, but the submit-event timing issue described for Pro Design also applies. Specify invalid-event capture/reveal or an equivalent pre-native-validation control path. A test must prove that no “invalid form control is not focusable” state exists and that all unchanged named values still serialize.
3. **P2 — Add overscan to the moving training photograph.** Moving an image exactly the size of its clipped frame from +18px to -18px can reveal blank strips at its top or bottom. Pro Design now reserves 40px vertical overscan; adopt at least 36px total plus a small margin, or a slight fixed scale calibrated to the actual frame. Credit belongs outside that moving/cropped layer. Test entry and exit positions, not only the still midpoint screenshot.
4. **P2 — Name the moving photo and a stable target.** The plan says “broad training-life photograph” without committing to an asset, while its neighbouring image and section may change in synthesis. Choose gallery-10 as the moving broad technical exchange, a specific second static photo and a named frame timeline. The content stays meaningful without motion; this simply makes implementation review objective.
5. **P2 — Update the Classes intro to the new page order.** The body still says “Explore the programmes, then check the timetable”, but v2 intentionally puts only a short introduction before the timetable and detailed programmes after it. Use “Explore classes and check the timetable” or “Check upcoming times and find the right class.” This is a small but avoidable flow/copy mismatch.
6. **P2 — Use Dublin-local grouping keys as well as formatted hours.** Same existing UTC-prefix concern as Pro Design. This is a public rendering change only, preserving data and member booking behaviour.

## Final synthesis view

The peers now agree on the important design: an authentic split portrait opener, Attic typography/colours, editorial alternatives, live-source offer and readable pricing, named coaches, one bounded photo scene, truthful gallery and a practical enquiry. Remaining decisions concern reliability and precision, not adding sections or effects. Carry Pro Design's overscan/motion details and Taste's early schedule/editorial rows into the final build. Preserve Hormozi's honest conversion semantics, and settle generic plan CTA wording before implementation.
