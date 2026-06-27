import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VERTICALS, verticalBySlug } from "@/lib/verticals";
import { TREASURE_VALLEY, REGION_NAME } from "@/lib/geo";
import { BRAND } from "@/config/brand";
import { pageMetadata, faqJsonLd, JsonLd } from "@/lib/seo";
import {
  Section,
  Eyebrow,
  H2,
  Lead,
  CTAButton,
  Card,
  Badge,
} from "@/components/ui";

interface VerticalPageProps {
  params: Promise<{ vertical: string }>;
}

export function generateStaticParams(): { vertical: string }[] {
  return VERTICALS.map((v) => ({ vertical: v.slug }));
}

export async function generateMetadata({
  params,
}: VerticalPageProps): Promise<Metadata> {
  const { vertical } = await params;
  const v = verticalBySlug(vertical);
  if (!v) {
    return pageMetadata({
      title: "Page not found",
      description: "This page could not be found.",
      noindex: true,
    });
  }
  const title = `Websites for ${v.plural} in ${REGION_NAME}`;
  const description = `${BRAND.name} builds done-for-you websites for ${v.plural} across ${REGION_NAME}. SEO-optimized, with a real buy button and automated follow-up — launched in days, run for a flat monthly fee.`;
  return pageMetadata({
    title,
    description,
    path: `/websites-for/${v.slug}`,
  });
}

const INCLUDED: { title: string; body: string }[] = [
  {
    title: "A site that ranks locally",
    body: "Built around the exact terms your customers search, with city pages for every town you serve so you show up on Google.",
  },
  {
    title: "A real buy or booking button",
    body: "Customers tap once to book, pay a deposit, or buy — no phone tag, no lost after-hours leads.",
  },
  {
    title: "Automated follow-up",
    body: "Missed-call text-back, AI lead triage, and review requests run on their own so nothing slips.",
  },
  {
    title: "Proof that converts",
    body: "Reviews, trust badges, and clear pricing laid out the way buyers in your trade actually decide.",
  },
];

export default async function VerticalPage({ params }: VerticalPageProps) {
  const { vertical } = await params;
  const v = verticalBySlug(vertical);
  if (!v) notFound();

  const otherVerticals = VERTICALS.filter((x) => x.slug !== v.slug);

  const faqs = [
    {
      q: `How fast can my ${v.name.toLowerCase()} site go live?`,
      a: `Most ${v.plural} are live within days. You answer a short onboarding, we generate the full site, and you approve it.`,
    },
    {
      q: `Will it show up when people search "${v.searchTerms[0]}"?`,
      a: `Yes — your site is built to target the terms your customers search and includes a dedicated page for every Treasure Valley city you serve.`,
    },
    {
      q: "What does it cost?",
      a: `One simple setup, then a flat monthly fee that covers hosting, the booking/buy flow, and the follow-up automation. No per-lead charges.`,
    },
  ];

  return (
    <main>
      <JsonLd data={faqJsonLd(faqs)} />

      {/* Hero */}
      <Section className="bg-brand-50/40">
        <Eyebrow>Websites for {v.plural}</Eyebrow>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          <span aria-hidden="true" className="mr-2">
            {v.emoji}
          </span>
          Websites for {v.plural} in {REGION_NAME}
        </h1>
        <Lead className="max-w-3xl">{v.pain}</Lead>
        <p className="mt-4 max-w-3xl text-lg text-ink-soft">
          {BRAND.name} fixes that. We build {v.name.toLowerCase()} a
          fully-built, SEO-optimized site with a real buy button and the
          follow-up automated — then run it for a flat monthly fee.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <CTAButton href="/start">Start my site</CTAButton>
          <CTAButton href="/#pricing" variant="ghost">
            See pricing
          </CTAButton>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {v.searchTerms.map((term) => (
            <span
              key={term}
              className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm text-ink-soft ring-1 ring-brand-100"
            >
              <span aria-hidden="true" className="mr-1.5 text-brand-500">
                🔍
              </span>
              {term}
            </span>
          ))}
        </div>
      </Section>

      {/* What's included */}
      <Section>
        <Eyebrow>What your site includes</Eyebrow>
        <H2>Everything a {v.name.toLowerCase()} business needs to get found and get booked</H2>
        <Lead>
          No DIY builders, no agency retainers. One generated site, built for
          how {v.plural} actually win customers.
        </Lead>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <Card key={item.title}>
              <h3 className="text-lg font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-ink-soft">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Cities served */}
      <Section className="bg-brand-50/40">
        <Eyebrow>Built for {REGION_NAME}</Eyebrow>
        <H2>We help {v.plural} win in every Treasure Valley city</H2>
        <Lead>
          Your site ships with a dedicated, locally-optimized page for each
          city you serve — so you rank where your customers actually live.
        </Lead>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TREASURE_VALLEY.map((city) => (
            <Card key={city.slug}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-ink">
                  {city.name}, Idaho
                </h3>
                <Badge>{city.zip}</Badge>
              </div>
              <p className="mt-2 text-sm text-ink-soft">{city.blurb}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <Eyebrow>Questions</Eyebrow>
        <H2>What {v.plural} ask before they start</H2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {faqs.map((f) => (
            <Card key={f.q}>
              <h3 className="text-lg font-bold text-ink">{f.q}</h3>
              <p className="mt-2 text-ink-soft">{f.a}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Cross-link other verticals */}
      <Section className="bg-brand-50/40">
        <Eyebrow>Other trades we build for</Eyebrow>
        <H2>Run a different kind of business?</H2>
        <div className="mt-8 flex flex-wrap gap-3">
          {otherVerticals.map((o) => (
            <CTAButton
              key={o.slug}
              href={`/websites-for/${o.slug}`}
              variant="ghost"
            >
              <span aria-hidden="true" className="mr-1.5">
                {o.emoji}
              </span>
              {o.name}
            </CTAButton>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section>
        <Card className="bg-brand-600 text-center text-white">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to launch your {v.name.toLowerCase()} site?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-50">
            Answer a few questions and we'll generate your complete,
            SEO-optimized site for {REGION_NAME} — buy button and follow-up
            included.
          </p>
          <div className="mt-8 flex justify-center">
            <CTAButton href="/start">Start my site</CTAButton>
          </div>
        </Card>
      </Section>
    </main>
  );
}
