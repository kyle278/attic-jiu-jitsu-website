# Hormozi cross-critique, round one

Scope: review of `prodesign-v1.md` and `taste-v1.md` only. No implementation changes. References remain shared research, current project and live Attic evidence. Priorities describe conversion/clarity risk, not measured losses. What converts best remains a hypothesis until tested.

## Pro Design v1

### Keep

- Excellent distinction between public discovery, enquiry and member booking. The same primary action, explicit confirmation semantics and direct Members route remove ambiguity without changing the service.
- Tangible catalogue offer with exact term/inclusions and missing-record fallback is stronger than generic gym transformation copy. Avoiding savings anchors, fake scarcity and review counts is correct.
- A portrait training hero on a solid ink split protects both headline readability and the real photo. Retaining existing type and colour is evidence-led.
- Clear source-data and CSS boundaries, updated Next Image deprecation note, gallery-metadata correction and a capped verification process make the plan readily implementable.
- Programme routes as native links and visible group anchors suit low-friction local membership research better than a quiz/filter gate.

### Actionable weaknesses

1. **P1: Home repeats the first-step explanation in too many separate blocks.** Hero reassurance, programme routes, starter panel, a separate three-step sequence, FAQ and final form each explain how to begin. That may delay coach proof and make the long page feel more administrative than welcoming. Keep the exact three steps, but compress them into a small line beside the final enquiry or replace one FAQ answer with them. Retain full coach/photo proof between offer and questions. Acceptance: the sequence from offer to coach evidence does not require passing another large instructional section.
2. **P1: Plan-specific enquiry intent is lost at the generic form.** Every plan says “Ask about this plan” but leads to the same form without preserving which plan. The visitor must remember/type a long family or beginner name. Add a page-local, optional prefill mechanism only if the existing portal field schema allows it: selected plan name appended to existing message, visibly editable and never erasing entered text. If that is out of scope, use an honest CTA “Ask about membership” and visible prompt to name the plan. Do not add a required hidden selection or modify the API. Acceptance: either intent survives, or copy does not imply a contextual enquiry that the form cannot deliver.
3. **P2: The hero phrase “A place for everyone” is inclusive but broad.** It is compatible with the research, yet can sound like universal suitability across ages, accessibility needs and medical conditions. Keep the warmth and pair it immediately with precise supported routes. Do not add stronger “all abilities / every age” copy elsewhere. Alternative “A place to start” narrows the primary decision while body and route links welcome experienced members.
4. **P2: “A team that knows your name” is a service-experience claim with no direct evidence.** It is plausible for a local club but not verified by the research. Replace with “Meet the people teaching you” or “Coaching with experience” until member testimony supports that specific personalised promise.
5. **P2: Classes may delay the timetable for returning users.** Three open programme rows before timetable can become a long mobile preamble. Keep the direct hero anchor, use compact programme summaries, and test the jump destination with the sticky header. The timetable must be reachable in one click from every page, including an open mobile menu. Keep education, but do not require it before a known task.
6. **P2: Acquisition intent is under-specified despite excellent tracking preservation.** Add a practical mapping: beginner social → beginner guide/offer; parent content → youth; ongoing-training content → timetable. A generic home destination for every promotion wastes the specificity of the work. Distinguish CTA intent from successful enquiry and confirmed attendance in reporting. No campaigns need launching.

## Taste v1

### Keep

- The hero “Your first class. Your next challenge.” welcomes a wider experience range without a result guarantee. Supporting BJJ/Carlow copy makes the otherwise broad headline understandable.
- Editorial pricing rows keep full descriptions and periods visible. The rejection of artificial monthly comparisons and all-plan preservation is important for the actual family catalogue.
- One bounded photograph scene and a compact hero make motion compatible with public information and low JS cost. Strong mobile, focus and reduced-motion requirements.
- Asymmetric portraits and authentic training detail create identity without outside art direction. Mobile single-column simplification is sensible.
- Explicit acquisition unknowns, guarded youth ages and protected booking boundaries prevent the design from becoming a new unsupported business offer.

### Actionable weaknesses

1. **P1: The concrete beginner offer sends its strongest action to another information page.** “Explore memberships” is dominant and “Ask about this programme” is small. By this point the visitor already sees current price, term and contents. Make the contextual enquiry the primary action in this offer block and membership comparison the secondary link. This avoids making motivated beginners navigate again while retaining the comparison path. Do not add two filled buttons. Acceptance: a visitor who accepts the shown programme can reach enquiry directly from its panel.
2. **P1: Existing gallery categories are unsafe inputs.** The plan allows current metadata to drive filters, but the inspected `gallery-4.jpg` metadata says no-gi while the picture shows gi. This can mislead someone using imagery to understand the class format. Either use a complete unfiltered gallery with neutral captions or build an explicit page-local inspected mapping. Do not modify protected `site-data.ts`. Acceptance: no category or caption claims an activity not shown.
3. **P1: No-JS gallery promise needs concrete markup.** “Full gallery and normal full-image links” alongside click-to-modal triggers can be accidentally implemented as JS-only buttons. Specify native anchor thumbnails and intercept only after enhancement is active. No-JS menu should likewise have discoverable links instead of a nonfunctional button. Otherwise the claimed fallback is aspirational.
4. **P2: First-visit uncertainty is answered implicitly across several areas.** The photo/coach story is strong, but the visitor still needs to understand what happens after enquiry. Add a concise visible sequence at the final form: send enquiry, discuss suitable class, attend only after arrangements are confirmed. Use this instead of another broad reassurance sentence. Do not promise reply speed or a reserved spot.
5. **P2: Proof strip repeats route information rather than adding coaching evidence.** “Beginners / Adults kids teens / gi no-gi” appears again immediately in route rows. Replace one strip item with verified “Coaches training since 2009”, making clear it is training history rather than academy founding. This raises perceived likelihood with an actual fact without introducing metrics.
6. **P2: The scroll composition has a mismatch between ambition and mechanism.** The plan says two photo planes move at different rates, but the table requires native scroll timelines and no scroll listeners, while the component section allows an isolated motion leaf. Commit to one strategy: native timelines with static fallback, or a tiny intersection-gated controller. Do not let the builder import a large animation dependency or leave transforms installed on reduced-motion/mobile. A static composition is acceptable if support is absent.
7. **P2: Acquisition path and per-plan intent should be made explicit.** Preserve query/UTM capture, map audience to matching sections, and either preserve plan interest through an editable existing message prefill or label the CTA generically. Do not introduce a new submission schema. Report enquiry sent separately from booking/attendance; retain a helpful phone path on script failure.

## Recommendation for synthesis

Take Pro Design's technical precision and explicit gallery truthfulness, Taste's editorial pricing and compositional rhythm, and a direct catalogue-backed beginner enquiry action. The largest shared risk is extra browsing work between accepting a specific programme and asking about it. Resolve that without changing booking, commercial terms or consent requirements. Keep first-visit explanation short, practical and visible at the actual enquiry destination.
