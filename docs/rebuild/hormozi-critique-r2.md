# Hormozi cross-critique, round two and final

Reviewed both peers' v2 plans. This is the second and final design critique round, not a request for another cycle. No code changes or new inspiration sources. Findings are implementation acceptance risks, not proven conversion losses.

## Pro Design v2

### What is now strong

- Compact route/offer/coach sequence is improved. Moving first-visit steps beside enquiry removes duplication while preserving reassurance at the relevant moment.
- Generic membership enquiry plus an explicit plan-name prompt is a valid bounded choice. It does not pretend to carry a selected plan and does not require a new payload contract.
- Precisely scoped native photo timeline, overscan and static fallback resolve the previous ambiguous advanced-motion instruction. The photo credit is outside the moving layer.
- Timetable is now a quick task. Detail anchors below it still serve beginners and parents arriving through route-specific links.
- Form serialization, route-loaded CSS checks, source-backed descriptions, native gallery links and actual coaching facts all remain implementation requirements.

### Remaining changes before final plan

1. **P1: Verify attribution across the complete browsing path, not only fields on the final form.** Current ContactForm populates hidden UTM fields from `window.location` on the page containing it. A visitor arriving at `/memberships?utm_source=instagram&utm_campaign=beginner` then using a plain `/#trial-form` link can reach a URL with no query. “Existing UTM capture remains intact” does not establish that the original campaign survives this journey. Add a non-delivery acceptance path with the entry query, intermediate Classes/Memberships page, final enquiry, and captured FormData. Preserve existing names and consent/tracker semantics. If the current integration already persists attribution, prove it; otherwise carry only supported attribution parameters in public CTA links or use an existing authorised persistence mechanism. Do not rewrite protected tracker/library code or introduce a new analytics provider. A documented limitation is more honest than claiming end-to-end attribution without testing it.
2. **P1: Resolve native browser constraint validation before the submit handler.** Keeping required personal-detail inputs hidden on step two preserves payload, but `onSubmit` alone cannot reveal an invalid hidden control when the browser blocks dispatch before submit. Specify either consistent custom validation using `noValidate` and per-step `checkValidity/reportValidity`, or an invalid-capture path that reveals the relevant step before focusing the field. Keep inactive consent requirements from blocking step one. Test Enter as well as Continue/Send. Do not disable step-one named controls, because disabled controls leave FormData. This is a concrete form mechanic, not a request for more form complexity.
3. **P2: Define a stable Home starter destination if acquisition links use it.** The mapping still says add an anchor “only if used”. Final synthesis should decide once, e.g. `/#beginner-programme`, and ensure the heading is visible below the sticky header. This is an implementation choice, not a new route. Keep no-plan fallback within the same anchored section, so a previously shared promotion never lands in nothing.
4. **P2: Keep the inclusive headline qualification close.** Retaining “A place for everyone” is reasonable with the supplied brand evidence. Ensure supported adult/kids/teens routes appear on that same hero screen and no later copy expands it into “every age”, disability access or universal class eligibility. This is a narrow wording guardrail; no new disclaimer is needed.

## Taste v2

### What is now strong

- The direct beginner enquiry action fixes the information-page detour. The source plan-name prompt is honest and keeps the form contract small.
- Native mobile disclosure and anchor thumbnails make no-JS fallbacks actual markup choices, rather than intentions.
- The single moving gallery-10 layer plus static detail is a credible motion scene without giving every section an entrance effect.
- Full source terms, editorial membership rows, complete unfiltered gallery and precise audience anchors make the page useful beyond its initial visual impression.
- Factual coaching proof adds something different from the route selector. The clarification of training since 2009 avoids a false academy founding claim.

### Remaining changes before final plan

1. **P1: Same cross-page attribution risk.** The existing form reads the current page's query. An Instagram beginner visitor entering the Classes anchor may browse memberships and then hit a plain home form link with no original query. Add a complete entry→browse→enquire non-delivery test and keep existing payload field names. Do not interpret unchanged hidden inputs as proof that campaign values survive. Resolve through existing integration behaviour or minimal public link handling; no protected member/library changes.
2. **P1: Same pre-submit validation edge case.** “Reveal/focus an invalid step on final submission” needs an explicit mechanism because native validity can prevent submit events for hidden required fields. Use custom per-step validation or invalid-event capture, preserve successful-control serialization, and test Enter on first step, Back, final Submit, error retry and optional marketing unchecked. Name/email must remain in FormData when the details wrapper is hidden.
3. **P2: Readable advanced-photo framing needs overscan.** The motion scene translates the inner image ±18px inside a reserved frame. A precisely frame-sized image leaves an exposed strip at one edge unless its image box is larger than the clipping frame. Adopt Pro Design's concrete 40px vertical overscan or an equivalent reserved inner size; keep credit outside the transformed layer. This is a visual defect to prevent, not more motion to add.
4. **P2: Add short desktop acceptance explicitly.** The plan references a typical 1366×768 hero in prose, but its verification list omits that size. Add it and check action visibility with the real sticky header, long title wrap and any credit caption. At 320px, prioritize complete words and natural flow over a two-to-three-line ambition. No clipping or tiny text to satisfy an arbitrary line count.
5. **P2: Finish the canonical starter anchor decision.** The acquisition mapping mentions a catalogue starter panel without its actual destination. A stable anchor on that section supports targeted content and honest fallbacks even if the programme record is temporarily missing. It costs no new business logic.

## Final synthesis recommendation

The plans now agree on the material product decisions. Preserve the true source-backed offer, compact first-visit explanation, direct experienced/member tasks and one composition-led motion moment. Remaining effort should verify the complete enquiry and attribution path, rather than add more persuasion or another page section. None of these recommendations changes booking, commercial terms, consent policy or authorises campaign execution.
