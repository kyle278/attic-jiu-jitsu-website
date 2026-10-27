# Taste implementation review

27 October 2026. Final implementation review, separate from the two completed design critique cycles. Reviewed current public source, latest `build-brief.md` and `form-experience.md`, supplied desktop hero/Home screenshots, mobile hero/Home screenshots and desktop memberships screenshot. No browser/server launched and no source modified. The user’s latest requirements take precedence: dark throughout, full-width photographic carousel, more motion/parallax, no emoji, almost no arrows, guided enquiry and authorised privacy page.

## Positive findings

- **The dark direction works.** Ink/charcoal sections, off-white condensed type and real red mats retain Attic’s identity. There are no bright reading blocks, decorative emoji or an excess of arrow furniture. The result is materially more coherent than the original glowing/card-heavy public site.
- **The desktop hero has presence and clear task priority.** The 1440 screenshot shows a readable subject/location, welcoming supporting line, one filled enquiry action and a quieter timetable link. Full-width real photography provides the requested cinematic impact without replacing real training with effects.
- **Mobile typography and primary actions fit.** The 390px hero screenshot has complete words, both actions and readable supporting copy. Logo, Members and native Menu fit cleanly. Carousel controls wrap intentionally rather than overflowing.
- **Pricing is clear and credible.** The memberships screenshot shows exact source periods, long family names, complete descriptions, category anchors and contextual enquiry links. Flat ruled rows suit this catalogue far better than narrow pricing cards. No fabricated saving/popularity/availability labels appeared.
- **Photo and coaching rhythm is deliberate.** Colour detail photographs contrast usefully with monochrome coaches. Factual named coach copy and simple portraits are convincing local proof. The site stays dark without making every section visually identical.
- **The enquiry structure respects the updated scope.** Training-intent choices are real text/SVG buttons; details stay mounted; validation uses `noValidate`; required response/privacy and independent accuracy remain distinct from optional unchecked marketing. Policy link is independent and opens without losing answers. No child identity is requested. Parent guidance and honest “enquiry, not reservation” wording are good.
- **Several technical safeguards are correctly implemented.** Dublin day keys use `Intl.DateTimeFormat` rather than slicing UTC strings. The starter uses the canonical adult beginner slug. Context links encode the real displayed plan name. Native mobile disclosure and full-image anchors remain useful without JS. Gallery uses neutral checked captions, complete contained dialog images and focus return. Public styles are scoped, with document-level rules conditional on an existing public shell.
- **Motion is appropriately layered.** Hero crossfade/zoom and native desktop parallax meet the user’s increased-motion request. The later photo scene has reserved framing and ample overscan. Reduced-motion CSS disables transforms/transitions; the JS carousel disables automatic selection under the preference.

## Findings to fix in the consolidated batch

### P1 — Pause does not pause the moving photograph

**Source:** `src/components/hero-carousel.tsx:22–27`, `:32–36`; `src/app/(website)/website.css:368`.

The `running` value only controls the 7.5-second slide-selection timer. The active image’s independent 8.5-second `attic-ken-burns` CSS animation has no paused/running class or `animation-play-state`. Clicking Pause, hovering, focusing the carousel or hiding the tab leaves the current photograph zooming. The visible control therefore fails to stop all of the automatic motion it appears to control. With JS disabled, that CSS motion also runs while the manual controls cannot operate.

**Fix:** expose enhanced/running state to the carousel root and gate automatic CSS animation behind enhancement; set image `animation-play-state` from the same running state used by the timer. Pause should freeze current progress rather than restart the photograph. Decide whether explicit Pause also freezes scroll parallax; at minimum it must stop the autonomous zoom and crossfade sequence. Static no-JS output should have no unpausable >5-second motion. Confirm by comparing image transform before/after a short paused wait, then Play resumes; test hover/focus and reduced motion too.

### P2 — Mobile slide crop loses the human subject

**Evidence:** `screenshots/one/hero-390.png` on slide 02; CSS mobile `object-position: 58% 50%` at `website.css:446`.

The desktop discussion photo shows a strong face and clear technical exchange. Its shared mobile crop shows mostly arms/gi and dark background; both recognisable faces are outside or at the edge of the frame. Copy remains readable, but the image loses the human coaching evidence that makes this club different.

**Fix:** define a source-inspected mobile focal point per slide instead of one `58%` value for all three. For gallery-10, favour the right-hand participant’s face; for the ground photos keep at least one face plus the recognisable training position. Retain the existing overlay, complete headline and CTA fit. Review all three mobile states, not just the default frame.

### P2 — Programme route links have no visible interaction cue after arrow removal

**Source:** `website.css:125–129`; Home programme rows.

Removing arrows was the right user-directed change. However, the resulting ruled heading/description rows have neither persistent link treatment nor hover styling; the screenshot reads like static programme copy. Keyboard focus is visible, but mouse/touch discovery depends on guessing the large heading is clickable.

**Fix:** keep the arrow-free design and underline the programme title, or add a restrained persistent “Explore classes” text cue. Add a 140–180ms underline/border/tone response on hover/focus without moving the row. Do not bring back decorative arrows or boxed feature cards.

### P2 — Campaign capture misses query-only navigation

**Source:** `src/components/public-attribution.tsx:18–31`.

The public attribution effect depends only on pathname. Navigating within the same pathname from one campaign query to another does not update the session record. The form reads the current query while it remains on Home, but if the visitor then browses away before enquiring, a later return can use the older session campaign. This is narrower than the normal Classes→Memberships path, which is correctly covered by pathname changes.

**Fix:** also observe the supported query signature with the existing public Suspense boundary, and retain the whitelist/current-query precedence. A non-delivery QA scenario should update only query parameters on one public path, browse to another page and then confirm the new campaign in FormData. Do not store contact values or drafts.

### P2 — Selected plan is not checked against the published catalogue

**Source:** `src/components/contact-form.tsx:62–65`.

Contextual plan links are built correctly, but the form accepts every nonempty `plan` query and appends it as the selected interest. The final plan specified validating against current published names so stale/shared URLs do not suggest a removed plan is currently offered. This is not an injection defect—the value is plain textarea text—but it is a remaining truthfulness/context state gap.

**Fix:** pass the existing read-only published plan names into the public form and use an exact match before prefill. For absent/stale/unknown values, keep a generic editable enquiry and optionally explain that the visitor should ask about current options. Preserve drafts and unchanged field names.

### P2 — Success reset hides the focused submit control without a new focus destination

**Source:** `src/components/contact-form.tsx:73–79`.

The success listener resets to step one via `setStep(1)` rather than `showStep`, while keyboard focus can remain on Send enquiry inside the newly hidden step-three wrapper. The live status announces success, but the next keyboard position is unpredictable.

**Fix:** after genuine success, focus a dedicated visible success status/heading (with `tabIndex=-1`) or the visible form heading after React updates. Keep the success message, do not automatically re-enter the new enquiry flow, and verify Tab proceeds to meaningful visible controls.

## Refinements that are optional, not blockers

- Gallery-10 appears in the carousel, beginner offer and large training-life scene. It is a strong image, but swapping one secondary usage for another already-owned suitable training photograph would reduce repetition without changing the visual direction.
- All three carousel images are eager-loaded at `sizes="100vw"`. Only the initial image is the LCP preload; deferring or gently scheduling subsequent slides could reduce initial mobile network competition. Measure in the existing QA round before changing it, because no performance outcome is established by screenshots/source alone.
- The hero is readable and has welcome copy, but the most recognisable mobile frame should be verified at 320px and 1366×768 alongside the new per-slide focal points. No broad redesign is needed.

## Review limits and acceptance

This review identifies source-backed mechanics and screenshot-backed composition issues. It does not claim live production enquiry delivery, measured conversion gains, ad performance or byte-identical booking files; those require the root’s existing QA/hash evidence. I did not run a browser, send a lead or exercise member workflows. After the consolidated fixes, one confirming round should cover Pause/Play image transforms, all mobile hero slides, keyboard success focus, query-only campaign persistence and stale-plan handling. No third design critique cycle is needed.
