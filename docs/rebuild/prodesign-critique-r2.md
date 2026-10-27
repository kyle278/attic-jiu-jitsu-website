# Pro Design → peer critiques, round two (final)

Reviewed Taste v2 and Hormozi v2. This is the second and final design critique round. No new inspiration references or source edits. Both revisions now have a strong shared foundation; the following focuses on remaining implementation decisions rather than reopening the identity.

## Taste v2

### Positive decisions to keep

- Direct starter enquiry, source-backed offer prose, generic membership wording and visible plan-name prompt resolve round-one conversion ambiguity without a new form schema.
- Native disclosure navigation and native image anchors make the no-JS claim concrete. Full unfiltered gallery plus truthful local captions removes the misleading No-Gi metadata problem.
- The precise gallery-10 CSS timeline, static second image and static unsupported/mobile/reduced-motion states are now implementable and sufficiently distinctive.
- Mounted-step payload checks and actual FormData inspection address a material existing public-form defect. Error retention and genuine-success-only reset are correct.
- Editorial membership rows, early timetable and the three-line first-visit sequence produce a disciplined information hierarchy. No need for more sections.

### Remaining fixes, prioritised

**P1 — Reconcile the natural portrait ratio with the desktop hero grid and height.** The hero is still a 5/7 text/photo split and asks for a natural 2:3 photo. At a 1320px frame, a seven-column image can be roughly 740px wide and therefore 1110px tall, far beyond a 1366×768 opening. “Show actions without scroll” does not define whether the left column aligns at top, centre or bottom of that tall frame. Cap the desktop image block size explicitly (roughly 560–620px), align the text/action block at a predictable position, and use object-contain or a narrower actual image within the grid track. If retaining a wider photographic crop, specify exact adjacent credit and protected face/arm zone. State whether 5/7 is semantic grid tracks or the visible image width. Acceptance: top-to-bottom screenshot at 1366×768 has headline and both actions visible, and no unplanned 1000px hero blank space.

**P1 — Timezone correctness includes the day grouping key.** “Group by date” and “Carlow time” can still reproduce the current `.starts_at.slice(0, 10)` UTC grouping bug. A 23:30 UTC session during Irish summer time belongs to the next local day. Specify local Europe/Dublin date keys for public grouping as well as local display times, without changing source timestamps, `src/lib/**` or booking behaviour. Add one read-only synthetic boundary fixture including an overnight/DST-adjacent timestamp. This is a public presentation correction, not a timetable-data rewrite.

**P2 — Give the moving photograph explicit overscan and caption ownership.** The scene says bounded overflow but not how it prevents an empty strip at ±18px. Set inner photo vertical overscan ≥36px total (40px is practical), clip only inside a reserved frame, and keep caption/credit outside the moving layer. Native timeline support must not accidentally move the frame itself and create layout shifts. This completes the already-good mechanism.

**P2 — Codify the finite verification loop.** The v2 checklist covers many conditions but does not cap iterations. Root's Pro Design process is whole-site browser inspection, one consolidated fix batch, one confirming browser round. Treat tests at 320/390/1440 and targeted states as one batch; reserve the user's final three-agent review as a separate assessment. Avoid repeatedly revisiting a successful build without a new material failure.

### Revision recommendation

Keep the plan's architecture. Resolve hero geometry, Dublin grouping and bounded-image implementation; add the finite verification commitment. No additional brand, conversion component or motion scene is needed.

## Hormozi v2

### Positive decisions to keep

- Stable offer heading, canonical source prose and removal of optimistic kit parsing are strong improvements. The page can survive missing or changed catalogue records truthfully.
- The hero is now solid-ink text with decorative overlap only; responsive phrase wrapping replaces an arbitrary character limit.
- Neutral empty-schedule wording and a short introduction before actual times remove both a false business-state claim and a long preamble.
- Native photo links, corrected gallery captions, form payload persistence, current Next Image advice and post-navigation CSS checks resolve the major implementation risks raised previously.
- Native CSS photo motion gives the requested advanced composition a clear scope. The audience-to-destination acquisition mapping remains useful and appropriately unexecuted.

### Remaining fixes, prioritised

**P1 — Resolve per-plan intent rather than leaving the round-one ambiguity open.** Membership rows still say “Ask about this plan”, while prefill remains optional and the fallback is a plain generic form anchor. This still tells the visitor the form knows which plan was selected. Choose a single final behaviour: either generic “Ask about membership” plus visible “Include this plan name in your message”, or explicit visible editable prefill into the existing message field with no erased user text. State it as final, not “if the contract permits”; the existing message field already defines the allowed channel, and root needs an actionable design decision. A normal anchor is sufficient only with generic honest wording. Update all copies of the label in the document.

**P1 — Source-backed plan selection needs a deterministic identity.** The Home offer says “catalogue adult beginner name”, but does not specify selection by verified stable ID/slug. Require that lookup and an absent-record fallback, not name substring, cheapest price, first plan in Beginners, or fixed snapshot ordinal. Do not accidentally feature the children's starter or family beginner plan under adult copy when catalogue ordering changes. Published source prose remains canonical.

**P1 — Make local date grouping explicit, not only local time labels.** Existing public code derives the day key by slicing a UTC timestamp. That can assign a late-night Irish summer session to the previous day while showing a correctly localised hour. Require public view grouping in Europe/Dublin using the timestamp unchanged; do not alter API/lib data or booking. Include an overnight/DST-adjacent fixture in the verification batch.

**P2 — Remove a leftover inclusion-list instruction.** The mobile paragraph still says “Offer includes sit in a short vertical list”, while the revised offer rightly says source prose is canonical and a breakdown requires structured data. Make mobile layout explicitly display the same full source description; only a verified structured breakdown may be a list. Otherwise root may reintroduce the brittle manual inclusions removed from v1.

**P2 — Fix the desktop hero's maximum size and tested crop.** “Portrait ratio around 4:5 or uncropped natural” is still unresolved. Choose one frame strategy with a desktop block-size cap, a source-inspected object position and visible verified credit. The 104px text cap can fit well, but the portrait must not enlarge the hero beyond the target screen or shift actions into the lower edge. Test 1366×768 and 1440×900 explicitly with actual copy.

**P2 — Keep scene credits outside the transform.** The precise ±18px motion is good; add 40px inner overscan, a fixed image frame and static adjacent exact credit. Otherwise credit may clip or a blank frame edge may appear at an endpoint.

### Revision recommendation

Retain the evidence-led commercial flow and current technical safeguards. Finalise the generic/contextual enquiry decision, deterministic offer lookup, local day grouping and the small lingering layout contradictions. No additional commercial promises are necessary.

## Shared synthesis checkpoint

The plans have converged usefully: one short subject-specific hero, native route rows, a truthful catalogue offer, named coaches, one precise training-photo scene, practical questions and one enquiry destination. The outstanding risks are data/geometry details that code must respect, not a need for more creative directions. The final implementation should prove form serialization and member-style isolation alongside screenshots; visual polish alone cannot establish either.

Status: final round-two peer critiques complete. Own v2 unchanged, awaiting root's coordinated final revision dispatch.
