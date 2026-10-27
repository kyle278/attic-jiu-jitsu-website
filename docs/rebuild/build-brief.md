# Final coordinated build brief

27 October 2026. The research, three independent v1 plans, and exactly two all-to-all critique/revision rounds are complete. Each agent critiqued both peers in each round, then updated its own complete plan. Final inputs: [Pro Design v3](prodesign-v3.md), [Taste v3](taste-v3.md), [Hormozi v3](hormozi-v3.md). [Research and sources](research.md), [Offer Brief](offer-brief.md), [Leads Brief](leads-brief.md).

## Final design

Retain Attic's real badge, Barlow Condensed / Source Sans 3, red #c43148, ink #0f0c0d and chalk #f7f3f1. The public site becomes an athletic editorial composition: solid-ink hero text beside authentic portrait photography, open chalk reading sections, flat rules, sharp geometry and generous spacing. A red mat boundary is the signature detail. The first screen identifies Brazilian jiu jitsu, Carlow, beginner welcome and adult/youth routes. Hero copy: “Serious jiu jitsu. A place for everyone.” No stock or generated people, luxury pretence, invented reviews, discounts, free classes or false booking promises.

Home: photographic hero and actions → factual proof strip → open programme routes → exact current adult beginner catalogue offer → named coach proof → one photographic scroll scene → practical FAQ → local details and enquiry. No standalone duplicate first-visit section. Offer CTA preserves selected plan name in a visible editable enquiry message. Adult starter lookup uses the canonical adults-beginners-program slug, not order or price. Its full source price/term/description remain canonical. Missing offer has a non-price contact fallback at stable #beginner-programme.

Classes: short intro, immediate #live-schedule, compact date/time/name/duration rows, then beginner/adult/youth programme explanations and all published class descriptions. Group timestamps by Europe/Dublin LOCAL day as well as formatting time locally. Never change source data, session availability or booking. Empty state says times are not listed and offers contact. Existing members use /members.

Memberships: source-backed pricing rows, audience jump links for nonempty groups, all published plans preserved including unknown groups, explicit price periods, full descriptions, plan-context enquiry. Keep #live-plans and #member-area. No implied checkout, popularity badges, discount claims or invented family coverage.

About: factual Carlow academy introduction, actual coach portraits and full verified biographies, adult/youth routes, contact. Gallery: all twelve original photos, visually verified neutral captions, editorial grid, native full-image link fallback and accessible dialog with full uncropped image, Escape/arrows/close and focus return. Do not reuse inaccurate existing categories. Photographer credit remains present or is transcribed adjacent to the crop.

## Interaction and motion decisions

Native details/summary mobile navigation works without JS. Desktop navigation includes Members and one filled Start training action. Active page underline, skip link, visible focus, 44px minimum targets. Plan links use /?plan=encoded-published-name#trial-form. The message remains editable and a new plan prompt never overwrites existing user text.

One 700–850ms hero entrance, with phrase stagger and a small image settle; all server-rendered content visible without animation. One desktop/fine-pointer CSS view-timeline photo scene moves gallery-10 by +18 to −18px, in a fixed frame with 40px vertical overscan and stationary caption. No scroll listeners, animation libraries, pinning, scroll hijack, custom cursor or perpetual carousel. Menu/arrow/dialog interactions use 160–220ms feedback. Mobile/reduced-motion/unsupported browsers receive deliberate static compositions. No new runtime dependency.

Enquiry fields stay mounted, named and enabled between steps. Explicit validation with noValidate handles Continue, Enter and final submission, reveals/focuses invalid first-step fields, and preserves the valid portal event contract. Consent names/requirements, external hooks, form slug and hidden attribution fields remain unchanged. Step copy becomes respectful and plain. Success is an enquiry success, not a reservation. Missing integration script fails closed with phone/email fallback. Public-only session storage retains supported campaign parameters across browsing; no contact fields or message drafts are stored. This preserves attribution without changing tracking consent or adding new trackers.

## Technical boundary

Read installed Next 16 guides for route groups, layouts/pages, Server/Client Components, CSS and Image. Keep server content, metadata, JSON-LD and existing tracker integration. Add only website-route scoped styles, public components and public presentation helpers. Root layout/globals, all member/API/lib/generated paths, booking components, member public assets and existing scripts are protected by the saved SHA-256 baseline. No catalogue sync, backend change or deployment. No live lead/test booking submission. All five public routes and legacy anchors stay usable.

## Verification and final peer review

### Later user steering (supersedes conflicting visual/form specifications above)

The user requested a dark vibe throughout, no bright sections, no emojis on mobile, and severe reduction of decorative arrows. All public reading sections now use ink/charcoal with off-white typography; decorative arrows have been removed. The user also requested a full-content-width photographic hero carousel with more motion and parallax. The revised hero uses three real academy photos, crossfades/slow photographic zoom, bounded native desktop scroll parallax, and visible Previous/Next/Pause controls. Autoplay stops on hover/focus/background tabs; reduced motion uses manual selection and static photos.

The explicitly requested Form Experience skill changes the public enquiry to a three-stage guided journey: training intent → contact details → independent privacy and optional marketing cards, then explicit submission. Names and email remain separate; phone is optional/collapsible, and no child data is requested. The user explicitly authorised creating a privacy policy after no approved URL was found. A new public /privacy-policy page and footer link are in scope. No extra design critique rounds were added; final implementation review uses this latest brief.

Complete site first; inspect one desktop/mobile browser batch across all five routes, plus targeted 320px/768px/1366×768, reduced motion, no-JS navigation, keyboard gallery/menu/FAQ and form serialization/error/success. Capture final FormData with fake local inputs without sending. Check campaign→Classes→Memberships→selected-plan→form attribution. Check a synthetic overnight summer timestamp for local-date grouping. Check prices against catalogue. Navigate public→Members and compare member pixels/hash baseline to catch CSS leakage. Run lint, TypeScript and production build, plus existing isolated member acceptance checks as appropriate.

After whole-site inspection, all three agents review implementation with positive and negative findings. Root consolidates justified fixes in one batch, then runs one confirming browser round. This final implementation review is separate from the exactly two completed design-plan rounds. Preserve honest limitations: no campaign effectiveness data, no verified active paid ads, and no production submission tested.
