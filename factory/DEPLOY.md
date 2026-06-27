# Deploy & go-live checklist

LaunchLocal deploys cleanly to **Vercel** (it's a standard Next.js 15 app). Below is
the path from "builds locally" to "taking real money."

## 1. Deploy the app (Vercel)

1. Push this repo; import the project in Vercel. Set the **root directory to `factory/`**.
2. Build command `pnpm build`, output is auto-detected.
3. Add env vars (see §2). Deploy.
4. Set `NEXT_PUBLIC_SITE_URL` to your real domain so canonical URLs, sitemap, and
   JSON-LD are correct.

## 2. Environment variables

Copy `.env.example`. Everything is optional — the app runs in demo mode without it.

| Var | Needed for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Correct SEO URLs | e.g. `https://launchlocal.com` |
| `STRIPE_SECRET_KEY` | Billing | From Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | Billing webhook | From the webhook endpoint you create |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client billing | Public key |
| `STRIPE_PRICE_STARTER/GROWTH/PRO` | Plan price IDs | Create 3 recurring prices |
| `ANTHROPIC_API_KEY` | AI lead triage | Without it, triage uses a templated reply |

## 3. Billing (Stripe)

1. Create 3 **recurring** products/prices ($99 / $199 / $399 mo) → put their price
   IDs in `STRIPE_PRICE_*`.
2. Add a webhook endpoint → `https://YOURDOMAIN/api/stripe/webhook`, subscribe to
   `checkout.session.completed` and `customer.subscription.deleted`. Put the signing
   secret in `STRIPE_WEBHOOK_SECRET`.
3. The webhook handler currently logs the slug/status — wire it to flip a tenant
   site active/inactive once persistence is in place (§4).

## 4. Persistence (the first real-production task)

`src/data/sites.ts` is an in-process `Map`. Newly onboarded sites won't survive a
redeploy. Replace its four functions (`getSite`, `getAllSites`, `listSiteSlugs`,
`addSite`) with Postgres (Neon/Supabase/Vercel Postgres) queries against a `sites`
table whose row is the `SiteConfig` JSON. Nothing else in the app needs to change.

## 5. Before charging real customers

- [ ] Add auth (owners shouldn't edit each other's sites). The wizard is open today.
- [ ] Wire Postgres persistence (§4).
- [ ] Add blob storage for logo/photo uploads (wizard currently takes URLs).
- [ ] Connect customer domains (Vercel domains API or a CNAME flow per tenant).
- [ ] Replace the demo brand/phone/social in `src/config/brand.ts`.
- [ ] Add a real OG image at `public/og.png` and favicon.
- [ ] Register for SMS sending (A2P 10DLC) before turning on text-back automation.

## 6. Custom domains per tenant (later)

For each customer site you can either keep `/sites/[slug]` or map a real domain via
the Vercel Domains API and route by hostname. The renderer is already domain-agnostic.
