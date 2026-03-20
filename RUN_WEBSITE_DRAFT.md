Read `ingeniumportal/website-setup/client-onboarding/README.md` before doing anything else.
Read `ingeniumportal/website-setup/client-onboarding/RESEARCH_AND_COPY_WORKFLOW.md` before building anything.
Read `ingeniumportal/website-setup/client-onboarding/DESIGN_LANGUAGE_REQUIREMENTS.md` before building the UI.
Read `ingeniumportal/website-setup/client-onboarding/CLIENT_EXECUTION_CHECKLIST.md` before implementation and use it as a delivery checklist.
Read `ingeniumportal/website-setup/client-onboarding/PRODUCTION_PROVISIONING.md` before any portal organisation provisioning work.
Use the existing Ingenium Portal website onboarding workflow. Do not create a parallel intake path.
The normalized build request is in `attic-jiu-jitsu-website/.ingenium/website-build-request.json`.
Write assumptions and unanswered questions to `attic-jiu-jitsu-website/.ingenium/build-assumptions.md` if the intake is incomplete.

Your task:
- use the existing project workspace at `attic-jiu-jitsu-website` as the one and only website project folder for this build
- the canonical project folder name for this client is `attic-jiu-jitsu-website`
- do not create a second sibling project folder, alternate slug folder, or duplicate website workspace
- use Next.js + Tailwind CSS
- research the company before building, using any available local context plus web research to learn about its services, audience, positioning, and market
- review the current website before building if a URL is provided, but still do broader company research even when a website exists
- if a current website exists, inspect it for reusable assets and design clues such as logos, imagery, hero backgrounds, video usage, layout motifs, and typography
- if a current website exists, preserve strong brand signals from it when they still make sense, especially distinctive hero treatments and useful visual assets
- evaluate the current site's main fonts and supporting fonts; keep the main font direction when it fits, refine weak pairings when needed, and replace the main font only in the rare case that it clearly does not suit the brand
- if no current website is provided or reachable, continue with company research anyway and document what you were able to learn
- use the submitted intake as source of truth, filling small gaps with reasonable first-draft assumptions
- spawn one subagent to research similar companies, strong website flows, important sections, and recommended pages for this client type
- spawn a separate subagent to research customer-facing copy and SEO strategy for this website type
- follow the subagent/research instructions in the website-setup docs wherever they apply; do not skip them
- all final site copy must be customer-facing copy written for the client's audience; never write explainer copy addressed to Ingenium, the operator, or an internal reviewer
- avoid language like 'this website', 'this page', 'we built', 'our client', or any copy that explains the site instead of selling the service
- this run is for a first draft; focus on getting a strong local project scaffold and implementation in place
- when the draft is complete, create a new GitHub repo under `kyle278`, push the project, then deploy it to the Vercel team/project scope `kyle278`

Normalized intake summary:
- client: Attic Jiu jitsu
- slug: attic-jiu-jitsu
- current website: https://www.atticbjj.net
- brand direction: not provided
- required pages:
- Memberships
- Classes
- Home
- About us
- Gallery
- required forms:
- none provided
- primary conversion goal: not provided
- owner email: bconnolly85@hotmail.com
- GitHub target: kyle278
- Vercel target: kyle278
- production domain: not provided

When finished, leave a concise build summary in your final message.