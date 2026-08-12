# Marbella For Sale

Premium real-estate platform for Marbella and the Costa del Sol, created as a complete digital experience for international buyers, property owners and the agency team.

## Product scope

- Editorial luxury homepage and brand experience
- Advanced property catalogue with filters and sorting
- Detailed property pages, galleries, enquiries and related residences
- Saved properties experience
- New-development portfolio
- SEO-focused area guides
- Buyer guides and market content
- Seller acquisition and private valuation flow
- Contact, privacy and structured data
- Owner Studio concept for enquiries, properties, clients, viewings, marketing and SEO
- Responsive navigation and layouts

## Current status

This repository contains the first high-fidelity functional checkpoint. The catalogue and Owner Studio currently use representative demonstration data. Production integrations for persistent data, authentication, uploads, CRM and the live property feed will be added in later milestones.

## Stack

- Next.js 16
- React 19
- TypeScript
- Vinext / Vite
- Cloudflare-compatible server output

## Local development

Requirements: Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
```

Validation:

```bash
npm run lint
npm run build
```

## Routes

- `/` — Homepage
- `/properties` — Property catalogue
- `/properties/[slug]` — Property details
- `/developments` — New developments
- `/areas` and `/areas/[slug]` — Area guides
- `/sell` — Seller acquisition
- `/guides` — Buyer guides
- `/about` — Agency positioning
- `/contact` — Private enquiries
- `/studio` — Owner Studio concept
- `/privacy` — Privacy and legal information

## Ownership

Marbella For Sale concept platform. Design and development by Archic.
