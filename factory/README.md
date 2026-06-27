# LaunchLocal — the fast-food of end-to-end local business websites

One click gives any local business a fully-built, SEO/GEO-optimized website with a
real buy button and the follow-up automated — then we run it for a flat monthly fee.

This is the **factory**: a single Next.js app with two surfaces.

1. **The selling storefront** — the marketing site that sells the service to
   business owners (SEO/GEO landing pages, pricing, onboarding).
2. **The factory** — a config-driven engine that turns a `SiteConfig` into a
   complete local-business website, plus a self-serve onboarding wizard, Stripe
   subscription billing (the retainer), and the automation backbone.

> Built for the Treasure Valley, Idaho corridor (Meridian/Boise/Eagle/Nampa/Caldwell),
> but every part is data-driven and re-targetable. Strategy behind it lives in
> [`../playbook/treasure-valley-local-business-playbook.md`](../playbook/treasure-valley-local-business-playbook.md).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS · Zod · Stripe

## Quick start

```bash
cd factory
pnpm install
cp .env.example .env        # optional — runs in demo mode with no keys
pnpm dev                    # http://localhost:3000
```

Nothing requires API keys to run. Billing and AI triage are **env-gated**: with no
keys, checkout returns a friendly demo response and lead triage uses a templated
reply. Add keys to turn each on (see `.env.example`).

```bash
pnpm build      # production build (also typechecks)
pnpm typecheck  # tsc --noEmit
pnpm start      # serve the production build
```

## What's in the box

| Area | Routes / files |
|---|---|
| **Storefront** | `/`, `/how-it-works`, `/pricing`, `/templates`, `/faq` |
| **Programmatic SEO** | `/websites-for/[vertical]` — one page per business type |
| **Programmatic GEO** | `/locations/[city]` — one page per Treasure Valley city |
| **Onboarding wizard** | `/start` — pick vertical → prefill → edit → live preview → create → subscribe |
| **Generated tenant sites** | `/sites/[slug]` — rendered from a `SiteConfig` (2 live demos seeded) |
| **Billing** | `POST /api/checkout`, `POST /api/stripe/webhook` |
| **Automation** | `POST /api/leads` (capture + AI triage), `POST /api/reviews/request` |
| **Site CRUD** | `POST /api/sites` (create from wizard), `GET /api/sites` |
| **SEO infra** | `/sitemap.xml`, `/robots.txt`, JSON-LD (Organization, LocalBusiness, FAQPage) |

## The core idea: `SiteConfig`

Everything that differs between two customers' websites lives in one typed object
(`src/lib/site-config.ts`). The onboarding wizard **produces** one; the template
engine (`src/components/template/TenantSite.tsx`) **consumes** one. The renderer
never hard-codes a business detail — so adding a customer is just adding a config.

```
Owner input ──(wizard)──▶ SiteConfig ──(TenantSite)──▶ live SEO/GEO site
                              │
                              └─ stored via src/data/sites.ts (swap for Postgres)
```

## How each customer site maps to the playbook

- **Buy button** → `booking.mode` (`checkout` | `booking` | `lead`) + financing flag
- **Local SEO/GEO** → `citiesServed` drives service-area copy + LocalBusiness JSON-LD
- **Automation backbone** → `/api/leads` does missed-call-text-back + AI triage;
  `/api/reviews/request` produces the +1-day review ask
- **The retainer** → Stripe subscription plans in `src/lib/plans.ts`

## Going to production

See [`DEPLOY.md`](./DEPLOY.md) for the Vercel + Stripe + Postgres + domain checklist.
Architecture details are in [`ARCHITECTURE.md`](./ARCHITECTURE.md).
