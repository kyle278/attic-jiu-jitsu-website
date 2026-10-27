# Pro Design → peer critiques, round one

Read both independent v1 plans in full. This is critique only; Pro Design v1 remains unchanged until the root dispatches revisions. References remain shared research, repository and live Attic evidence. Priorities: P0 blocks truthful/reliable delivery, P1 important implementation acceptance, P2 design refinement.

## Taste v1

### Keep

- The constrained editorial identity and mat-edge motif are recognisably derived from Attic, rather than another club's luxury identity. Separating hero copy from the portrait photograph is especially strong.
- The Memberships editorial rows support real long plan wording and billing terms better than narrow SaaS cards. Preserve this as a strong candidate in synthesis.
- Static, readable server output plus optional CSS scroll timelines is a good technical fit. The specific ≤28px image movement and mobile/reduced-motion fallbacks are usable implementation instructions.
- The task-oriented Classes page puts actual times near the top and retains all catalogue items, including unknown categories. This avoids a common design-led failure.
- The accessible dialog is explicitly optional: a basic image link is preferable to shipping an overlay with incomplete focus handling.

### Fix

**P0 — Make enquiry serialization an explicit requirement, not merely “keep field names”.** The current `contact-form.tsx` conditionally unmounts first-step inputs when step two appears. A native submit can therefore omit the user's name/email/message. The plan says Back retains data but gives no mechanism; the current component's uncontrolled fields also lose those values when unmounted. Keep both steps mounted in hidden/visible wrappers or hold values in state and serialize the same named fields reliably. Validate only visible relevant inputs, focus first invalid field, and inspect actual outgoing FormData in a non-delivery test. Preserve consent names, attributes, UTM and events. This is authorised public-enquiry work; no booking changes are needed.

**P1 — Resolve inaccurate gallery metadata before offering filters.** The asset sheet visibly shows gi clothing in gallery-4 despite the source “No-Gi” category. “No new labels may imply programmes absent from catalogue” does not catch existing wrong labels. Inspect each source photograph and use a page-local corrected category/caption mapping, or remove filtering and use a complete grid. Leave `src/lib/**` unchanged. Include a concrete acceptance check that the image's visible content matches its label.

**P1 — Decide how a landscape mobile hero preserves a portrait credit.** The plan chooses 4:3 on mobile while hero-live is a portrait with bottom credit. This will require a strong crop, likely removing the credit and part of the action. Specify either a natural/near-portrait ratio, an uncropped contain presentation, or an adjacent exact verified credit and tested focal position. Do not postpone the credit decision to “when feasible”. The action must remain before the image.

**P1 — State a no-JS navigation fallback.** The in-flow menu's interaction model is good, but a JS-only toggle with desktop links hidden at narrow widths would remove public navigation when scripts fail. Use native disclosure, a noscript route list, or another explicit readable fallback. Phone/email fallback is already handled for enquiry and should have a navigation counterpart.

**P2 — Remove ordinal numbering from programme-choice rows.** “New”, “Already training” and “Kids & teens” are alternatives, not steps. Numbers imply a prescribed progression and subtly make parents appear third. Use the red rule/arrow and text hierarchy for rhythm; keep numbers only for a real first-visit sequence if included.

**P2 — Avoid a second broad choreography competing with the hero.** The optional two-photo scene is justified by research, but the plan's motion intensity 6 plus hero text, hero scale, mat rule, photo planes and gallery staggering could become effects at every major point. Keep the hero as the memorable opening, use only one bounded image transform in the later story, and make gallery filter updates instant or opacity-only. Root can remove the optional scene without losing the site's identity.

**P2 — Strengthen the H1's explicit subject without adding more hero copy.** “Your first class. Your next challenge.” is friendly but could describe any sport. The location line supplies the subject, so this is not an SEO blocker; nevertheless “Serious jiu jitsu. A place to start.” is more ownable and informative in a screenshot or screen-reader heading list. Keep Taste's welcoming support text and measured scale regardless of the final chosen wording.

### Preferred revision outcome

Retain the editorial pricing rows and pragmatic Classes layout. Add form serialization, truthful gallery categories, a decisive mobile crop/credit rule and no-JS navigation; simplify route-row numbering and optional motion.

## Hormozi v1

### Keep

- The distinction between observed uncertainty and an unmeasured conversion hypothesis is excellent. It avoids claiming research established a conversion rate problem.
- The offer is grounded in actual plan name, term and contents, and the plan warns against unlimited access, gear or household-coverage assumptions. This is the strongest commercial specificity of the three plans.
- One primary “Start training” action and separate Members route are clear. The enquiry/schedule/attendance/membership measurement distinctions should survive synthesis.
- The first-visit FAQ answers the visitor's actual question “Does this form reserve a class?” explicitly. Use this copy near the final action as well.
- The acquisition section proposes differentiated beginner/parent/experienced destinations without launching campaigns or claiming paid-ad evidence.

### Fix

**P0 — Add a reliable first-step value and payload contract.** The existing public enquiry component unmounts the personal-detail inputs before final submit. “Preserve field names” and “Back retains data” will not fix native serialization. Require the implementation to keep inputs mounted, or serialize controlled values into unchanged fields; test final payload includes first_name, last_name, email, optional phone/message, consent and UTM. Retain values on failure. This is a more meaningful conversion fix than an extra persuasive headline.

**P1 — Make “The kit. The classes. A clear beginning.” conditional on current offer evidence.** This headline itself promises kit before any catalogue description is read. It becomes misleading when the beginner record is absent or no longer includes equipment. Make the stable heading “A clear way to begin.” and show kit only in source-backed inclusion content; alternatively derive the heading conditionally from verified current record contents. The fallback must replace title and inclusions together.

**P1 — Do not transform a prose plan description into four inclusion claims through brittle parsing.** The cited record is a useful snapshot, but live descriptions may change. Keep the full source description visible as the canonical detail. Four lines can render from a verified explicit mapping keyed to a specific published plan and guarded by current contents, but must disappear rather than keep asserting stale kit/classes if that contract changes. Rendering exact prose is safer and sufficiently clear.

**P1 — Empty schedule copy must describe the page, not invent an internal business state.** “Class times are being confirmed” asserts the team is currently confirming them. A zero result could instead be sync failure or no upcoming sessions. Use “No upcoming class times are listed here. Contact the academy for the current timetable.” Do not infer cancellation, closure or confirmation activity from empty data.

**P1 — Update image implementation advice for installed Next 16.2.** “Keep hero priority” can lead root back to the current deprecated Image `priority` prop. Local bundled `image.md` says `priority` is deprecated and documents `preload`. Use the appropriate documented single-LCP approach with correct `sizes`, avoiding duplicate mobile/desktop preload downloads. This matters because AGENTS explicitly requires installed-version documentation.

**P1 — Add explicit protection against CSS leakage after navigating to Members.** Scoped stylesheet is specified, but route-group CSS may remain loaded on navigation per bundled Next CSS guide. Require every selector, including resets/media selectors and custom variables, to stay below `.website-shell`; no global `button`, `body`, `:root` or `html` overrides. Browser-check Home→Members after style load as well as direct Members. Hash equality alone cannot detect global CSS visually changing a byte-identical booking app.

**P2 — Remove text/photo overlap from the hero unless it has a proven readability purpose.** “Carefully controlled overlap” creates more crop/contrast work for no conversion benefit. The authentic portrait is already expressive. Keep the copy on solid ink and restrict overlap to the decorative red boundary. This also keeps credit and keyboard outlines clear.

**P2 — The 12-character headline-line target is too rigid for responsive Barlow.** It can produce a tall stack and crowd actions on 390px or force awkward line breaks. Treat the three semantic phrases as flexible blocks with a maximum 3–4 lines and use actual viewport fit as the acceptance criterion. Avoid max-character line rules in final implementation.

**P2 — Make first-visit steps a real visible sequence rather than only scattered FAQs.** The plan explains next steps through helper copy, but a compact three-step “Tell us / Choose a session / Come and train” block would make the journey easier to scan without inventing reply speed or a reservation promise. Keep it short, or place it immediately beside the enquiry rather than adding another large Home section.

### Preferred revision outcome

Retain evidence-led offer detail, route intent and measurement semantics. Prioritise reliable enquiry data, conditional offer promises, neutral empty states and protected-route CSS verification over extra persuasion. Keep the source plan wording canonical and the hero visually calm enough for the commercial facts to register.

Status: Round-one critiques of both peers complete. No own-plan revision performed yet.
