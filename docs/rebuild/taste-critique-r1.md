# Taste critique — round one

27 October 2026. Reviewed both peers' v1 plans against root research, existing project, and asset sheet. No independent inspiration references. This is critique round one of exactly two; own-plan revision waits for root dispatch.

## Pro Design v1

### Keep

- Strongest overall operational specification: protected hashes, route CSS persistence, read-only catalogue, tracking semantics and the current Next Image deprecation are concrete and useful.
- The opening copy “Serious jiu jitsu. A place for everyone.” directly answers the academy’s serious/welcoming tension. It identifies an inclusive culture without fabricated outcomes.
- Named coaching proof, truthful first-class enquiry semantics and exact billing terms make the page credible without review widgets or fake metrics.
- Correctly catches inaccurate gallery metadata: the existing No-Gi label must not survive simply because it is in site-data. Neutral captions or verified local overrides are better.
- Hero photography and solid text ground avoid the common legibility/cropping failure. The photo-credit fallback is explicit.
- Native in-flow menu and native dialog, no-JS escape paths, runtime reduced-motion handling and a finite verification loop are worth retaining.

### Prioritised changes

1. **P1 — Resolve the advanced motion scene instead of leaving it optional.** The user explicitly requested detailed advanced motion; the plan says the home photo scene is optional and describes it “over hero exits” while attaching it to a home photo scene. It is not clear which photograph moves, when it begins/ends, or how it relates to the later photo essay. Commit to one identified training-life composition, define viewport start/end and maximum transform, and use a static equivalent when unsupported. This is a precision issue, not a request for more motion everywhere.
2. **P1 — Reduce Home’s competing explanatory blocks.** The nine-part page includes proof, three routes, beginner offer, standalone three-step first visit, coaches, photo essay, five FAQ rows and enquiry. The first-visit block and enquiry/FAQ repeat the same reassurance. Merge the three-step sequence into a compact three-line summary beside the enquiry or place it adjacent to the offer. Preserve the practical steps but reduce travel before actual contact.
3. **P1 — Make the timetable visible earlier on the Classes task page.** Programme overview before schedule is defensible, but “open rows for adult beginner, adult ongoing and youth” plus a compact hero can still create a long mobile preamble. Keep the View timetable anchor and define a strict short preamble or start with the timetable after a two-sentence gi/no-gi introduction; place detailed programme descriptions below it. A novice arriving from the home youth link can jump directly to youth detail.
4. **P2 — Use a deliberate editorial route layout rather than a generic equal three-column row.** The proposed “three open rows/cards” and three desktop columns blur between alternatives. Choose stacked 4/8 editorial rows, or a clearly uneven 2/1 composition, so the home does not drift back into three familiar feature cards. The route hierarchy should come from content rather than matching boxes.
5. **P2 — Coach headline overstates personal familiarity.** “A team that knows your name” is warm but unverified and implies the reader already belongs. Replace with an observable coaching statement such as “Coaching with experience. People you can meet.” Keep named instructors and training dates as actual proof.
6. **P2 — Formalise the portrait's crop constraints.** The plan chooses a 46% portrait hero and correctly protects its credit; add its `object-position` and minimum visible body/face zone after source inspection, plus an actual 4:5/3:4 ratio choice. A 650–720px tall hero may crop differently from the first mobile composition. The final choice should be tested on 1366×768 as well as 1440×900, where a large header/hero can otherwise bury the actions.

## Hormozi v1

### Keep

- Strongest commercial logic: uncertainty is explicitly a hypothesis; the concrete offer shows class access, period and equipment; enquiry, attendance and membership are distinct events.
- Dedicated parent route is as visible as the adult newcomer route. Experienced students retain immediate timetable/member access.
- The source-backed record/slug and live catalogue term distinction prevents marketing from silently turning two months into unrestricted recurring access.
- Draft copy rejects artificial urgency, discounts, promises and fabricated ad activity. The plan explains what a page is for without starting unauthorised campaigns.
- Consent and portal event names remain intact; failed delivery cannot become a fake success state. This is essential, as is the phone/email fallback.
- Pricing groups remain readable, complete and accessible through anchor navigation rather than hide-and-seek filters.

### Prioritised changes

1. **P1 — Fix form persistence before styling.** The plan promises “Back retains data”, but current `ContactForm` conditionally unmounts uncontrolled step-one fields. A visual reskin cannot deliver this. Explicitly require keeping those fields mounted (hidden appropriately) or storing/restoring values, preserve form semantics on final submission, and test returning to step one plus checking the final FormData. Payload names cannot change. This is the most material implementation risk in the conversion flow.
2. **P1 — Remove hard-coded offer assumptions from the headline.** “The kit. The classes. A clear beginning.” remains visible if the beginner record disappears or loses equipment. Require a fallback heading “A clear way to begin” unless the current record actually includes kit, and derive inclusion lines from confirmed data rather than reparsing prose optimistically. Keep the exact catalogue contents below it.
3. **P1 — Tighten display sizing and line rules.** A 120px cap, 7.5vw and “max 12 characters per deliberately authored line” will make the hero very tall and can split the phrase “SERIOUS JIU JITSU” awkwardly. Choose responsive whole-phrase spans with natural wrapping and cap around 96–104px for the 1240px container; test mobile at 320px, currently absent from the width list. Avoid forced editorial line breaks that become clipping or four/five lines on a narrow phone.
4. **P1 — Do not invent what an empty schedule means.** “Class times are being confirmed” asserts a business state. An empty API/catalogue only proves no listed entries. Use “The next class times aren’t listed here yet. Contact the academy for the current timetable.” This preserves trust when a fallback or sync issue causes the empty list.
5. **P2 — Prefer native scroll enhancement over introducing a custom rAF scroll engine.** The plan alternates between requestAnimationFrame/passive listeners and CSS timelines. Commit to CSS scroll timelines with a static unsupported-browser fallback, or name the exact limited controller and cleanup if native support is insufficient. The evidence permits one restrained scene; it does not justify another framework or permanent scroll listener.
6. **P2 — Correct gallery metadata before reusing it.** Unlike Pro Design, this plan does not explicitly identify the existing No-Gi/gallery-4 mismatch. Apply a page-local mapping after visual inspection, or remove categories entirely and use neutral image captions. No JS is preferable to authoritative-looking false taxonomy.
7. **P2 — Resolve colour treatment across the photo story.** “Mainly monochrome” conflicts with the original colour mat photos unless the plan specifies selective CSS treatment. Retain black-and-white hero/coaches and natural colour gallery, with only a light consistent desaturation if desired. Do not darken all original photographs to make the site feel premium; the red mats are useful real-world brand evidence.
8. **P2 — Verify current Next Image guidance before implementing hero priority.** The plan says “keep hero priority”, but Pro Design checked the installed Next docs and found `priority` deprecated. The final build should use the documented `preload`/sizes choice for the single LCP image. Confirm actual installed docs; do not copy familiar old Next conventions.

## Shared synthesis recommendation

Combine Pro Design's technical boundaries and verified gallery correction with Hormozi's clear enquiry/offer hierarchy. Build one short hero, one editorial programme selector, one truthful catalogue offer, named coach proof, one measured photo scene, practical FAQ and enquiry. Preserve all five routes, and make timetable/member access feel immediate. The strongest design is neither longer copy nor more animations; it is a visible sequence of concrete decisions supported by Attic’s own room and people.
