import Link from "next/link";
import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { VERTICALS } from "@/lib/verticals";
import { pageMetadata, organizationJsonLd, JsonLd } from "@/lib/seo";
import { Section, Eyebrow, H2, Lead, CTAButton, Card } from "@/components/ui";

export const metadata: Metadata = pageMetadata({
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: BRAND.pitch,
  path: "/",
});

interface Feature {
  emoji: string;
  title: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    emoji: "🔎",
    title: "An SEO + GEO site that ranks",
    body: "Built to show up when people in your town search — schema, local pages, and fast load times baked in, not bolted on.",
  },
  {
    emoji: "🛒",
    title: "A real buy button",
    body: "Customers pay, book, or put down a deposit online. Stripe checkout, financing, and deposits — no more quoting in DMs.",
  },
  {
    emoji: "🤖",
    title: "Automated follow-up",
    body: "Missed-call text-back, AI lead triage, and automatic review requests turn the leads you were losing into booked jobs.",
  },
  {
    emoji: "🔧",
    title: "We run it every month",
    body: "You don’t touch a dashboard. We host it, keep it fast, update it, and report what it earned you — flat monthly fee.",
  },
];

interface Step {
  n: number;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    n: 1,
    title: "Pick your business type",
    body: "Choose your trade and city. We seed a site tuned for how your customers actually search and buy.",
  },
  {
    n: 2,
    title: "We build it in minutes",
    body: "Your services, prices, buy button, reviews, and service area — generated and ready to preview instantly.",
  },
  {
    n: 3,
    title: "Go live & we run it",
    body: "Approve it, we launch it on your domain, and the automated follow-up starts converting leads day one.",
  },
];

interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: "24/7", label: "Buy button that never sleeps" },
  { value: "<60s", label: "From sign-up to a live preview" },
  { value: "$0", label: "Setup fee — one flat monthly price" },
  { value: "100%", label: "Done-for-you, hosted & managed" },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="container-x py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-4">Websites for local business in {BRAND.region}</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">
              {BRAND.tagline}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-soft sm:text-xl">{BRAND.pitch}</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CTAButton href="/start">Build my site</CTAButton>
              <CTAButton href="/pricing" variant="ghost">
                See pricing
              </CTAButton>
            </div>
            <p className="mt-4 text-sm text-ink-faint">
              No setup fee. Live preview in under a minute. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* The problem */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>The problem</Eyebrow>
          <H2>Most local businesses have no buy button.</H2>
          <Lead className="mx-auto">
            You’re quoting ZIP-by-ZIP in Facebook DMs, missing after-hours calls, and watching
            ready-to-pay customers tap on the competitor who let them book in one click. Being great at
            the work doesn’t help when you’re invisible online — and impossible to pay.
          </Lead>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            "“DM me for a quote” → leads go cold overnight.",
            "No online checkout → the easy sale walks.",
            "You forget to ask → zero new reviews.",
          ].map((line) => (
            <Card key={line} className="text-sm font-medium text-ink-soft">
              {line}
            </Card>
          ))}
        </div>
      </Section>

      {/* What you get */}
      <Section className="bg-slate-50">
        <div className="max-w-2xl">
          <Eyebrow>What you get</Eyebrow>
          <H2>A complete sales machine — not just a website.</H2>
          <Lead>
            Every {BRAND.name} site ships with the parts that actually win local jobs, then we keep it
            running so you can stay on the tools.
          </Lead>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card key={f.title} className="flex flex-col">
              <span className="text-3xl" aria-hidden>
                {f.emoji}
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{f.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* How it works teaser */}
      <Section>
        <div className="max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <H2>Live in three steps.</H2>
          <Lead>From sign-up to a site that sells — most owners are live the same day.</Lead>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card flex flex-col">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-base font-black text-white">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <CTAButton href="/how-it-works" variant="ghost">
            See the full process
          </CTAButton>
        </div>
      </Section>

      {/* Verticals strip */}
      <Section className="bg-slate-50">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Built for your trade</Eyebrow>
          <H2>Templates tuned to how your customers buy.</H2>
          <Lead className="mx-auto">
            Each one knows your pain — booking, deposits, financing, or fast lead capture — out of
            the box.
          </Lead>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {VERTICALS.map((v) => (
            <Link
              key={v.slug}
              href={`/websites-for/${v.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              <span aria-hidden>{v.emoji}</span>
              {v.name}
            </Link>
          ))}
        </div>
      </Section>

      {/* Social proof / stats */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>The outcome</Eyebrow>
          <H2>Stop losing the easy sale.</H2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-4xl font-extrabold tracking-tight text-brand-600">{s.value}</p>
              <p className="mt-2 text-sm font-medium text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Pricing teaser */}
      <Section className="bg-slate-50">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm sm:p-14">
          <Eyebrow>Simple pricing</Eyebrow>
          <H2 className="mx-auto">One flat monthly fee. No setup cost.</H2>
          <Lead className="mx-auto">
            Pick a plan, we build and run everything. No contracts, no surprise bills — just a site
            that earns its keep.
          </Lead>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CTAButton href="/pricing">See plans &amp; pricing</CTAButton>
            <CTAButton href="/start" variant="ghost">
              Build my site
            </CTAButton>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <section className="border-t border-slate-200 bg-brand-600">
        <div className="container-x py-20 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your competitors already have a buy button.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-50">
            Get a site that ranks, sells, and follows up for you — built today, run for you every
            month.
          </p>
          <div className="mt-9">
            <Link
              href="/start"
              className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 text-base font-bold text-brand-700 shadow-sm transition-colors hover:bg-brand-50"
            >
              Build my site
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
