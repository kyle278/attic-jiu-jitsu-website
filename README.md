# Attic Jiu Jitsu Website

Marketing website draft for Attic Jiu Jitsu Carlow, built with Next.js and Tailwind CSS.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and fill in the Ingenium Portal values when available.

## Production checklist

- Add portal env vars to Vercel.
- Provision the matching Ingenium Portal organisation, site, and forms.
- Verify form submissions land in `website_form_submissions`.
- Verify analytics events land in `website_interaction_events`.
- Connect the final domain when it is approved.
