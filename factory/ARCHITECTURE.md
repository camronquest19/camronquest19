# Architecture

LaunchLocal is one Next.js App Router app with a clean seam between **the product
that sells** and **the factory that produces customer sites**.

## Directory map

```
factory/
├── src/
│   ├── app/
│   │   ├── (marketing)/        # the selling storefront (shares Header/Footer)
│   │   │   ├── page.tsx                 # home / sales page
│   │   │   ├── how-it-works/  pricing/  faq/  templates/
│   │   │   ├── websites-for/[vertical]/ # programmatic SEO (per business type)
│   │   │   └── locations/[city]/        # programmatic GEO (per city)
│   │   ├── sites/[slug]/       # GENERATED tenant sites (own minimal layout)
│   │   ├── start/             # onboarding wizard host page
│   │   ├── api/              # checkout, stripe/webhook, leads, reviews, sites
│   │   ├── sitemap.ts robots.ts layout.tsx globals.css
│   ├── components/
│   │   ├── storefront/        # Header, Footer (marketing chrome)
│   │   ├── template/          # TenantSite + sections (the renderer)
│   │   ├── onboarding/        # Wizard (client)
│   │   └── ui.tsx             # shared primitives
│   ├── lib/
│   │   ├── site-config.ts     # ⭐ the SiteConfig zod schema + types (the contract)
│   │   ├── verticals.ts       # the menu of business types we sell
│   │   ├── geo.ts             # Treasure Valley cities (GEO targeting)
│   │   ├── presets.ts         # starter SiteConfig per vertical (wizard prefill)
│   │   ├── plans.ts           # subscription tiers (the retainer)
│   │   ├── seo.tsx            # metadata + JSON-LD helpers
│   │   ├── stripe.ts          # env-gated Stripe client
│   │   └── automation.ts      # lead capture + AI triage + review messaging
│   ├── data/
│   │   └── sites.ts           # tenant store (in-process now; → Postgres later)
│   └── config/brand.ts        # the product's own brand (rename to rebrand)
```

## Data flow

1. **Discovery.** A business owner lands on a programmatic SEO/GEO page
   (`/websites-for/cleaning`, `/locations/meridian`) or the home page.
2. **Onboarding.** `/start` → the `Wizard` picks a vertical, prefilling a starter
   config from `presets.ts`, then collects business details. State is a typed
   `SiteConfig`, validated live with `safeParseSiteConfig`.
3. **Preview.** The wizard renders `<TenantSite config={draft} />` — the *same*
   component that powers the live site — so what they see is what they get.
4. **Create.** `POST /api/sites` validates and persists the config; returns `slug`.
5. **Subscribe.** `POST /api/checkout` opens a Stripe subscription (the retainer).
6. **Live.** The site serves at `/sites/[slug]` with LocalBusiness JSON-LD.
7. **Run it.** Inbound leads hit `/api/leads` (text-back + AI triage); after a job,
   `/api/reviews/request` produces the review ask.

## Key design decisions

- **One contract, two consumers.** `SiteConfig` is the only coupling between the
  wizard and the renderer. Add a field once and both sides get it.
- **Env-gated externals.** Stripe and Anthropic are optional. `billingEnabled` and
  the triage fallback keep every path working with zero keys — so the repo runs and
  builds anywhere, and you wire money/AI when ready.
- **Swappable persistence.** `src/data/sites.ts` is the single store seam. It's an
  in-process `Map` today; replace the four functions with Postgres queries and
  nothing else changes. (In-process means newly-created sites live only for the
  running server process — durable storage is the first production task.)
- **Programmatic pages = the growth engine.** Verticals × cities generate dozens of
  targeted landing pages from data, each statically rendered for speed and ranking.

## Production gaps (intentional, documented)

- Persistence is in-process — wire Postgres (`data/sites.ts`).
- Auth/owner dashboard not built — wizard is open; add auth before real billing.
- File uploads (logo/photos) take URLs today — add blob storage for real uploads.
- See `DEPLOY.md` for the full go-live checklist.
