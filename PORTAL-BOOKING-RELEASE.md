# Portal catalogue connection — 25 October 2026

The existing Attic Vercel project connects to Portal site 8b0e89c9-3090-46b2-b008-4d5c46233647. Wix and atticbjj.net DNS are unchanged.

Classes and memberships fetch the uncached public gym manifest on the server, with an explicitly verified public fallback snapshot. Production never attempts localhost. The catalogue contains 12 membership options, 10 class types and 13 dated timetable entries for 26–31 October, sourced read-only from atticbjj.net. Expired entries are filtered out; future weekly recurrence is not invented.

The member-login prototype is withheld while customer authentication, canonical booking integration and Stripe entitlements are being implemented. Enrolment and booking enquiries use the existing contact form and academy phone. Existing payment subscriptions and member records are not migrated or marked paid. Portal explicitly pauses Attic legacy login issuance/verification and booking writes until that integration is ready.

Validation: ESLint and Next 16.2 production build, followed by deployed page and public-feed verification. Existing tracking and contact-form integration remain in place.
