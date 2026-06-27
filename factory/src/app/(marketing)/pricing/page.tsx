import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata, JsonLd, faqJsonLd } from "@/lib/seo";
import { Section, Eyebrow, H2, Lead, Badge } from "@/components/ui";
import { PLANS } from "@/lib/plans";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = pageMetadata({
  title: "Pricing — flat monthly plans, no setup fees",
  description: `${BRAND.name} pricing: a fully-built, SEO-optimized local-business website with a buy button and automated follow-up, run for you on a flat monthly plan.`,
  path: "/pricing",
});

const PRICING_FAQS = [
  { q: "Is there a setup fee?", a: "No. You pay one flat monthly price. We build, launch, host, and maintain the site for that price." },
  { q: "Can I cancel anytime?", a: "Yes. Plans are month-to-month. Cancel anytime — no contracts." },
  { q: "Can I use my own domain?", a: "Yes. Connect a domain you own, or we can help you register one." },
  { q: "How fast can I go live?", a: "Most owners self-onboard and preview their site in well under an hour. We review and push it live shortly after." },
];

export default function PricingPage() {
  return (
    <main>
      <JsonLd data={faqJsonLd(PRICING_FAQS)} />
      <Section className="bg-gradient-to-b from-brand-50 to-white">
        <Eyebrow>Pricing</Eyebrow>
        <H2 className="max-w-3xl">Flat monthly plans. No setup fees. Cancel anytime.</H2>
        <Lead>
          Pick a plan, onboard your business in minutes, and go live. We build it, host it, and keep it
          running — you just take the customers.
        </Lead>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-7 shadow-sm ${
                plan.highlighted ? "border-brand-600 ring-2 ring-brand-600" : "border-slate-200"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-7">
                  <Badge>Most popular</Badge>
                </div>
              )}
              <h3 className="text-lg font-bold text-ink">{plan.name}</h3>
              <p className="mt-1 text-sm text-ink-soft">{plan.tagline}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-ink">${plan.priceMonthly}</span>
                <span className="text-sm text-ink-faint">/month</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
                    <svg className="mt-0.5 h-4 w-4 flex-none text-brand-600" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/start?plan=${plan.id}`}
                className={`mt-7 w-full justify-center ${plan.highlighted ? "btn-primary" : "btn-ghost"}`}
              >
                Start with {plan.name}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink-faint">
          All plans include hosting, SSL, and ongoing maintenance. Prices in USD.
        </p>
      </Section>

      <Section className="border-t border-slate-200">
        <H2>Pricing questions</H2>
        <dl className="mt-8 max-w-3xl space-y-6">
          {PRICING_FAQS.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold text-ink">{f.q}</dt>
              <dd className="mt-1 text-ink-soft">{f.a}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10">
          <Link href="/start" className="btn-primary">
            Build my site →
          </Link>
        </div>
      </Section>
    </main>
  );
}
