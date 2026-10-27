# Attic keyword research and website implementation

Research date: 27 October 2026. Scope: this Next.js website, the supplied “Attic BJJ Keyword Research: Carlow, Athy, Kilkenny” document, fresh web searches, the academy’s published class/plan catalogue and official activity guidance.

## Strategy

Keep high-intent Carlow jiu-jitsu searches as the commercial foundation. Add a second route for adults who want to get active but have not yet chosen a sport: beginner fitness, getting fit over 40, returning to exercise and alternatives to gym workouts. Connect those visitors to an accurate explanation of beginner BJJ, then to the current timetable and enquiry form.

This is qualitative keyword and search-intent research. No authenticated Keyword Planner, Search Console, Ahrefs or Semrush volume export was available. Search results establish relevant topics and competing offers; they do not establish monthly demand, keyword difficulty, positions in a location-specific Google session or ranking forecasts. Priorities below are editorial judgements based on intent, relevance to the actual offer and local specificity. Broad national fitness queries are longer-term targets, with much stronger competition than local class searches.

The implementation adds 11 focused landing pages, eight guides and one guide index. The six existing public pages remain, giving 26 public sitemap URLs. It improves the existing site’s content and navigation without changing the member booking flow.

## What the additional research changes

1. **Fitness has real local competition.** énergie’s own Carlow page promotes a broad class timetable and gym facilities. Empower’s Carlow website also offers classes. Attic’s useful distinction is learning a coached grappling sport, rather than trying to sound like a general gym or claiming to offer circuits, Pilates or personal training.
2. **Family, beginners and women’s training are not exclusive differentiators.** MYALO’s own Kilkenny site explicitly promotes families, beginner BJJ/wrestling, juniors and women-only classes. The attachment’s claim that other clubs do not combine these offers is not sufficiently supported. New copy describes Attic’s own programme and coaches without claiming superiority or exclusivity.
3. **Athy has more than one club signal.** Alongside the attachment’s Athy Jiu-Jitsu reference, fresh results identify Barròg Jiu-Jitsu in Athy, including a club-managed competition-platform listing. Do not treat the original competitor table as a complete census.
4. **“Over 40” needs more than an age keyword.** Irish fitness providers address confidence, restarting exercise, manageable schedules, coached progression and social connection. The content answers those practical questions rather than implying Attic runs a separate over-40 class.
5. **Men and women warrant distinct helpful guides.** The men’s guide addresses restarting after a sedentary period and comparing present ability with past sporting experience. The women’s guide addresses class environment, mixed versus women-only preferences and where individual health advice is appropriate. Both link to a broader over-40 guide and actual beginner classes.
6. **Avoid inventing programmes.** The public catalogue supports gi/no-gi beginners, kids 6–11, teens 12–15, students and family plans. It does not establish women-only sessions, an over-40-only course, a dedicated menopause programme, free first classes, guaranteed childcare or parent-and-child shared sessions. None is advertised as an offer.
7. **Use one real location.** Athy and Kilkenny pages state that training is in Carlow. They provide distinct journey and family planning information and route links rather than fabricated local branches, testimonials or guaranteed travel times.
8. **Local ranking is not distance alone.** Google describes relevance, distance and prominence. A prediction that Attic can “own Carlow” or cannot appear in a particular map pack is not an established outcome. Work on accurate business details, relevant services, genuine reviews and links, then measure the result.

## Keyword map

P1 = direct class/joining intent and strong fit. P2 = useful adjacent discovery or a narrower local audience. P3 = broader informational or travel-dependent opportunity. Related variants share a page; they are not instructions to repeat every phrase in the copy.

| Cluster | Target and close variants | Intent | Priority | Implemented destination |
| --- | --- | --- | --- | --- |
| Carlow BJJ | bjj carlow; jiu jitsu carlow; brazilian jiu jitsu carlow; bjj gym carlow; jiu-jitsu classes carlow | Find a club | P1 | `/` |
| Carlow martial arts | martial arts carlow; martial arts classes carlow; adult martial arts carlow | Compare activities | P1 | `/` and `/classes`, with the home page as primary local academy target |
| Hyperlocal | jiu jitsu graiguecullen; bjj charlotte street carlow; martial arts graiguecullen | Find a nearby academy | P1 | `/` and `/areas-we-serve` |
| Beginners | bjj for beginners carlow; beginner jiu jitsu classes carlow; adult beginner martial arts carlow; learn jiu jitsu carlow | Start training | P1 | `/beginners-bjj-carlow` |
| Beginner programme | eight week bjj course carlow; jiu jitsu beginner programme; beginner bjj equipment included | Compare a starting offer | P1 | `/beginners-bjj-carlow` |
| Gi/no-gi timetable | no gi carlow; nogi beginners carlow; grappling carlow; gi classes carlow; bjj timetable carlow | Choose a session | P1 | `/classes` |
| Beginner fitness | fitness classes carlow; beginner fitness classes carlow; get fit carlow; exercise classes carlow beginners | Find an activity | P1 | `/fitness-classes-carlow` |
| Gym alternatives locally | alternatives to gym carlow; fun fitness classes carlow; get fit without a gym carlow; fitness through martial arts carlow | Choose an enjoyable activity | P2 | `/fitness-classes-carlow` |
| Fitness over 40 | how to get fit over 40; getting fit after 40; exercise after 40 for beginners; how to get back in shape at 40; restarting fitness at 40 | Learn how to start | P2/P3 nationally | `/blog/how-to-get-fit-over-40` |
| Men over 40 | how to get fit over 40 male; fitness for men over 40; getting fit at 45 male; return to exercise men over 40; beginner fitness for men over 40 | Find a realistic starting routine | P2/P3 | `/blog/fitness-for-men-over-40` |
| Women over 40 | how to get fit over 40 female; fitness for women over 40; getting fit at 45 female; beginner exercise for women over 40; returning to exercise women | Choose a suitable activity | P2/P3 | `/blog/fitness-for-women-over-40` |
| Gym reluctance | how to get fit without a gym; exercise if you hate the gym; fun ways to get fit; alternatives to gym workouts; social fitness activities | Compare approaches | P2/P3 | `/blog/get-fit-without-a-gym` |
| Older BJJ beginners | starting bjj at 40; starting jiu jitsu over 40; am i too old for bjj; martial arts after 40; beginner bjj over 40 | Evaluate a contact sport | P2 | `/blog/starting-bjj-over-40` |
| Women locally | womens bjj carlow; jiu jitsu for women carlow; women beginner martial arts carlow; fitness for women carlow | Evaluate a class and setting | P2 | `/womens-bjj-carlow` |
| Self-defence | self defence classes carlow; self defence carlow; bjj self defence carlow; womens self defence carlow | Learn practical skills | P1/P2 | `/self-defence-classes-carlow`, linking to the women’s introduction |
| Kids | kids martial arts carlow; kids jiu jitsu carlow; childrens martial arts carlow; bjj for kids carlow | Choose a children’s activity | P1 | `/kids-martial-arts-carlow` |
| Kids activity goals | after school activities carlow; kids confidence classes carlow; kids self defence carlow; anti bullying martial arts carlow | Parent research | P2 | `/kids-martial-arts-carlow`, with honest limits around bullying |
| Parent education | is jiu jitsu good for kids; benefits of bjj for children; choosing martial arts for a child; what do kids learn in bjj | Compare an activity | P2 | `/blog/is-jiu-jitsu-good-for-kids` |
| Teens | teen martial arts carlow; teen jiu jitsu carlow; activities for teenagers carlow; teen fitness carlow; teen self defence carlow | Choose a teen activity | P2 | `/teens-jiu-jitsu-carlow` |
| Family | family martial arts carlow; family bjj membership; parent and child martial arts carlow; siblings martial arts carlow | Compare family coverage | P1/P2 | `/family-martial-arts-carlow`, stating separate appropriate classes |
| Students | student bjj carlow; SETU carlow martial arts; student fitness carlow; student jiu jitsu membership | Find an affordable sport | P2 | `/students`, without claiming a SETU partnership |
| Pricing | bjj prices carlow; jiu jitsu membership carlow; bjj beginner course cost; family martial arts prices | Compare costs | P1 | `/memberships` |
| National cost research | how much does bjj cost in ireland; jiu jitsu ireland prices; bjj membership and equipment cost | Budget for joining | P2/P3 | `/blog/how-much-does-bjj-cost-in-ireland`, with no invented national average |
| First class | what to wear to first bjj class; what to bring to jiu jitsu; first no gi class clothing; first bjj class ireland | Prepare to attend | P2 | `/blog/what-to-wear-first-bjj-class` |
| Coaching | black belt bjj carlow; jiu jitsu coaches carlow; Darren Curtis bjj; Brian Connolly jiu jitsu | Establish trust | P1/P2 | `/about-us` |
| Athy | kids martial arts near athy; kids jiu jitsu athy; beginner jiu jitsu near athy; family martial arts near athy | Compare nearby alternatives | P2 | `/athy`, clearly based in Carlow |
| Kilkenny | kids jiu jitsu near kilkenny; family martial arts near kilkenny; beginner bjj near kilkenny; carlow jiu jitsu from kilkenny | Compare travel-dependent alternatives | P2/P3 | `/kilkenny`, clearly based in Carlow |
| Other towns | martial arts near tullow; jiu jitsu near tullow; martial arts bagenalstown; martial arts muine bheag; martial arts leighlinbridge; bjj near castlecomer | Find nearby training | P2/P3 | `/areas-we-serve` |
| Near me | bjj near me; martial arts near me; kids martial arts near me; beginner fitness classes near me | Location-dependent discovery | P1, ongoing | Real business address, local schema and accurate Google Business Profile; no artificial “near me” page |

The new content targets well over 100 related phrase variants through a limited set of substantial pages. Search engines can associate normal language with related queries; spelling every variant out on a page would make the writing worse.

## Page relationships and avoiding overlap

- **Home** is the main local academy page for “BJJ Carlow”. **Classes** owns schedule and format queries, rather than repeating the same home page pitch.
- **Fitness landing page** explains the actual Carlow service to people comparing activities. The **general over-40 guide** answers the broader habit/routine question. The **starting-BJJ-over-40 guide** handles contact, tapping, beginner pace and equipment questions. Their intent differs even though they cross-link.
- The **men’s guide** and **women’s guide** use distinct sections and concerns. Neither claims there is a separate gender-specific or over-40 course at Attic.
- **Kids**, **teens** and **family** pages answer different enrolment questions. Family coverage is distinct from a shared parent-and-child class.
- **Memberships** remains the source for current plan prices. Relevant landing pages read the same catalogue, with the existing fallback behaviour, rather than hard-coding prices from the attachment. The cost article links to that source and does not invent an Irish market average.
- **Athy**, **Kilkenny** and **areas** describe the single Carlow location, real age groups and practical travel decisions. No copied town-name substitutions, unverified member stories or claimed drive-time guarantees.
- The guides are linked from the new guide index, relevant landing pages, the home page and the footer. Class and location pages also link to related programmes. New pages are reachable within three clicks of home.

## Technical and on-page audit findings addressed

| Finding in the repository | Impact | Change |
| --- | --- | --- |
| Home H1 was “Serious jiu jitsu.”; several page headings and titles were generic slogans | Weak topic/location clarity | Home H1 now “Jiu jitsu in Carlow.”; class, coaching and membership headings and titles identify their topic |
| Root metadata used the Wix domain while managed canonicals and sitemap used the registered Vercel origin | Conflicting site identity in fallback metadata | Root metadata, canonicals, social URLs, schema and sitemap consistently use the registered project origin |
| No discoverable topic pages for most programme/fitness searches | Limited ability to answer different search intent | Added the 20 pages described above |
| Social-title fallback treated absolute title objects as the generic academy title | Page-specific titles lost on sharing | Resolve absolute titles correctly; generate matching Open Graph and Twitter metadata, while preserving Portal overrides |
| Sitemap used the current timestamp rather than content edit dates | Misleading freshness signal | Use a stable substantive content revision date and include the new public routes |
| Robots excluded `/members/` but did not explicitly cover exact `/members` | Incomplete crawl rule for private app entry | Add `/members$`, retain `/members/`, exclude APIs and editor query variants; `/memberships` remains allowed |
| LocalBusiness-compatible academy schema existed, but no article/guide navigation schema | Missing semantic context for new content | Retain SportsActivityLocation; add BreadcrumbList, BlogPosting and guide CollectionPage/ItemList as appropriate |
| No visible publication/organisation context for new guides | Readers need source and ownership context | Attribute guides to Attic, link the academy background, show actual edit date and cite primary HSE material where used |
| One existing cookie-policy link failed the Next.js lint rule | Site-wide lint could not pass | Replace the internal anchor with the framework Link component |

Existing robots/noindex protection on members and editor previews remains in place. Managed Portal SEO retains precedence; baseline updates do not bypass staff-published settings. Structured data describes the content that is actually visible. No fabricated reviews, ratings, qualifications, offers or FAQ rich-result eligibility were added.

## Search evidence and sources

Searches included local beginner fitness, Carlow over-40 fitness, Irish male/female return-to-exercise queries, BJJ over 40, Attic programme queries, Athy clubs and Kilkenny beginner/family offers. Mixed result sets sometimes returned irrelevant geography or stale directories. The findings below use identifiable sources and do not treat one search result set as a rank-tracking report.

| Source | Research use |
| --- | --- |
| [Attic home](https://www.atticbjj.net/) | Academy address, coach backgrounds and legacy claims; cross-checked against the repository’s programme data |
| [Attic published memberships](https://www.atticbjj.net/plans-pricing) | Cross-check of introductory, student and family offer categories; website display continues to use the Portal catalogue |
| [Attic published classes](https://www.atticbjj.net/book-online) | Beginner gi/no-gi formats and kids/teen age groups |
| [MYALO’s own website](https://myalofit.com/) | Confirms active family/junior/beginner/women-only positioning in Kilkenny; prevents false exclusivity claims |
| [énergie Fitness Carlow](https://www.energiefitness.com/gym/carlow) | Confirms local general fitness/class competition and a broad current timetable |
| [Empower Fitness Carlow classes](https://www.empowerfitness.ie/classes) | Additional local gym/class provider; not confused with similarly named businesses in other counties |
| [Barròg club listing on Smoothcomp](https://smoothcomp.com/en/club/63099) | Additional Athy club signal; no claim about its current class timetable |
| [Irish Fit Coach over-60s programme](https://irishfitcoach.ie/what-we-do/over-60s-club/) | Adjacent Irish audience positioning around social, comfortable introductions to exercise; not evidence of Carlow demand |
| [SoulMoves midlife strength](https://www.soulmoves.ie/soulmoves/book-your-space/p/midlife-july) | Irish example of women-40+ class language; not treated as a currently bookable Attic service |
| [HSE activity guidance](https://www2.hse.ie/living-well/exercise/increase-activity/) | Primary source for general gradual activity and enjoyment/context recommendations |
| [HSE lifestyle activity](https://www2.hse.ie/living-well/exercise/active-for-your-lifestyle/) | Everyday activity and realistic routines |
| [HSE Get Active](https://www2.hse.ie/living-well/exercise/get-active/about/) | A genuine gradual activity resource, alongside the BJJ option |
| [HSE menopause guidance](https://www2.hse.ie/conditions/menopause/things-you-can-do/) | Carefully bounded exercise context in the women’s guide; no claim that BJJ treats symptoms |
| [Every Move Counts national guidelines](https://www.hse.ie/eng/about/who/healthwellbeing/our-priority-programmes/heal/every-move-counts/every-move-counts-national-physical-activity-and-sedentary-guidelines-for-ireland.pdf) | Adult aerobic and strengthening targets in the main over-40 guide |
| [Google local ranking guidance](https://support.google.com/business/answer/7091?hl=en) | Relevance, distance and prominence; no promised ranking outcome |

## Measurement and remaining external work

The changes are in this checkout. Deployment, DNS/domain migration, Google Business Profile edits, outreach, directory changes and Search Console submission were not performed as part of the source changes. The existing live Wix domain is separate from the registered Vercel site. For the full benefit on atticbjj.net, deploy this application to the intended production domain and update the project’s origin configuration and Portal registration together. Do not create canonicals pointing at an old site that does not serve these pages.

After deployment:

1. Confirm which domain should be indexed, ensure it serves these routes, and submit its sitemap to Search Console. If migrating Wix, map known old routes such as `/plans-pricing` and `/book-online` to their real successors; do not blanket redirect old articles/events to unrelated pages.
2. Use Keyword Planner with Ireland and relevant counties to add actual volume ranges. Use Search Console to measure queries and pages rather than interpreting the research priorities as volume estimates.
3. Monitor separately: local BJJ, kids/family, beginner fitness, men/women over 40 and nearby-town groups. Track impressions, clicks, relevant landing pages and genuine enquiries across approximately 28/56/90 days; low-volume groups may take longer to assess.
4. Inspect any Portal-published metadata overrides before replacing them. New pages are instrumented for the website editor; adding them to the Portal’s registered page inventory is a separate integration publication step.
5. Keep Google Business Profile name/address/phone accurate, describe only actual services, use real photos and invite honest reviews. Never prescribe keyword wording or guarantee a local rank.
6. Expand from real questions and query data: BJJ versus other sports for children, fitness for desk workers, and first-session nerves are sensible next topics if visitors show interest. Do not publish thin pages for every town, age and spelling variant.

## Verification

`scripts/verify-seo.mjs` checks the rendered local production site, including all 26 public routes without client JavaScript, unique metadata, canonical and social URLs, JSON-LD, internal links, crawl reachability, mobile overflow, navigation, private/noindex boundaries and invalid URLs. Results are saved in `verification.json`; representative desktop/mobile screenshots are saved alongside it. The browser harness blocks external requests and does not submit enquiries, send messages or book classes.

Verified on 27 October 2026: production build and ESLint pass; 58 SEO/browser acceptance checks pass with zero failures; the 10 existing membership/proxy logic tests also pass. Representative pages were checked at 320, 390, 1100 and 1440 pixels. Local preview: `http://localhost:3320/blog` while the production preview server is running. These results verify the checkout, not a deployment or a search-ranking outcome.
