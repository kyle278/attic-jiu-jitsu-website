# Attic research, coordinated plans and rebuild

## Start here

- [Research and source links](research.md): BJJ academies, professional membership businesses, advanced motion references and evidence of advertising/lead-generation methods. Active paid campaigns, ad spend and performance were not inferred from social profiles.
- [Compiled build brief](build-brief.md): synthesis, protected booking boundary, and the user’s later dark-theme, arrow-free, carousel and form instructions.
- [Form Experience assessment](form-experience.md): field purpose, journey, payload, privacy and verification decisions.
- [Offer Brief](offer-brief.md) and [Leads Brief](leads-brief.md): Hormozi analysis and proposed acquisition work. No ads or outreach were launched.

## Exactly two design critique-and-revision rounds

| Agent / method | Independent plan | Round 1 critique of both peers | Revised plan | Round 2 critique of both peers | Final plan |
| --- | --- | --- | --- | --- | --- |
| Pro Design | [v1](prodesign-v1.md) | [r1](prodesign-critique-r1.md) | [v2](prodesign-v2.md) | [r2](prodesign-critique-r2.md) | [v3](prodesign-v3.md) |
| Taste | [v1](taste-v1.md) | [r1](taste-critique-r1.md) | [v2](taste-v2.md) | [r2](taste-critique-r2.md) | [v3](taste-v3.md) |
| Offers / Leads | [v1](hormozi-v1.md) | [r1](hormozi-critique-r1.md) | [v2](hormozi-v2.md) | [r2](hormozi-critique-r2.md) | [v3](hormozi-v3.md) |

Each agent independently planned the whole public website. Each critiqued both peers in each round, read both critiques of itself, and revised its own complete plan. User steering during implementation supersedes older bright-section and two-step form proposals. There was no third design-plan round.

## Final implementation feedback

All three agents reviewed the built site and provided positive and negative findings:

- [Pro Design review](prodesign-implementation-review.md)
- [Taste review](taste-implementation-review.md)
- [Hormozi review](hormozi-implementation-review.md)

The consolidated fix batch addresses carousel pause/hover/focus motion, query-only and partial campaign attribution, published-plan validation, mobile image cropping, visible arrow-free link cues, a focused enquiry receipt, and timetable length via native later-date disclosure. Source JSON-LD remains in server HTML; only the executable external tracker uses next/script. Installed React’s data-block exemption was checked so the JSON-LD does not reintroduce the reported script warning.

The first browser batch also identified an accessible-label problem after validation; errors are now separate from associated labels. Its member pixel comparisons initially compared a loading screen with a completed error screen, not a style regression. The confirming batch fixes transport state to the same isolated error fixture and excludes only the development badge region. Protected-file hashes remain the definitive scope check.

Three optimised hero photos are loaded eagerly to keep carousel changes ready; no unmeasured performance or conversion improvement is claimed. The privacy page is based on observed functionality and verified business details; provider locations, transfer arrangements and operational retention still need the academy’s confirmation. The public rebuild is deployed at https://attic-jiu-jitsu-website.vercel.app. Portal release evidence and remaining staff-session checks are in [the connection report](../portal/README.md).

## Verification artifacts

- [Protected file baseline](protected-before.json)
- [First inspection](verification-one.json)
- [Confirming inspection](verification-two.json)
- [Motion behaviour](motion-verification.json)
- [Confirming screenshots](screenshots/two/)

The rebuild browser fixtures never send a production enquiry or live booking. The later Portal acceptance pass sent one explicitly labelled synthetic enquiry under the Forms skill; its receipt is recorded separately in [release verification](../portal/release-verification.json). No live booking was created. Existing member-plan/proxy tests and the isolated member-app acceptance script passed without changing their source. The confirming public-site batch passed 75 checks, with one benign desktop member-logo raster difference confined to the original 40px image; member layout and original files remained unchanged.
