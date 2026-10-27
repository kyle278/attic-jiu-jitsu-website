# Attic Jiu Jitsu Website

Marketing website for Attic Jiu Jitsu Carlow, built with Next.js and Tailwind CSS.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Public Portal identity is configured in `portal-connect.json` and `src/portal/public.ts`.
The editor and SEO publisher use site-scoped server variables configured on Vercel:
`INGENIUM_PORTAL_ORIGIN`, `INGENIUM_EDITOR_SITE_KEY`,
`INGENIUM_EDITOR_SIGNING_SECRET`, `INGENIUM_SEO_SITE_KEY`,
`INGENIUM_SEO_SIGNING_SECRET`, and `INGENIUM_SEO_SNAPSHOT_BASE_URL`.
Keep signing secrets server-only. Never copy Portal database or storage credentials here.
The member application retains its existing `BOOKING_MEMBER_PROXY_KEY` configuration.

## Production checklist

- Production: https://attic-jiu-jitsu-website.vercel.app
- Portal connection evidence and remaining checks: `docs/portal/README.md`.
- Rebuild research, three-agent plans and two critique rounds: `docs/rebuild/README.md`.
- Run `npm run build`, `npm run lint`, the member tests and `node scripts/verify-portal.mjs` before release.
