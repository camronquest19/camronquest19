import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TREASURE_VALLEY, cityBySlug, REGION_NAME } from "@/lib/geo";
import { VERTICALS } from "@/lib/verticals";
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

interface CityPageProps {
  params: Promise<{ city: string }>;
}

export function generateStaticParams(): { city: string }[] {
  return TREASURE_VALLEY.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const c = cityBySlug(city);
  if (!c) {
    return pageMetadata({
      title: "Page not found",
      description: "This page could not be found.",
      noindex: true,
    });
  }
  const title = `Small business websites in ${c.name}, Idaho`;
  const description = `${BRAND.name} builds done-for-you, SEO-optimized websites for small businesses in ${c.name}, Idaho (${c.zip}). Real buy button, automated follow-up, flat monthly fee.`;
  return pageMetadata({
    title,
    description,
    path: `/locations/${c.slug}`,
  });
}

const LOCAL_ANGLE: { title: string; body: string }[] = [
  {
    title: "Rank for your city, not the whole web",
    body: "We build around the exact searches your neighbors make — your trade plus your town — so the right local customers find you first.",
  },
  {
    title: "Capture the leads you're missing",
    body: "Missed-call text-back and a one-tap buy or booking button turn after-hours searches into paying jobs.",
  },
  {
    title: "Look bigger than the competition",
    body: "Clean design, real reviews, and clear pricing make a one-person shop look like the most trusted name in town.",
  },
];

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  const c = cityBySlug(city);
  if (!c) notFound();

  const otherCities = TREASURE_VALLEY.filter((x) => x.slug !== c.slug);

  const faqs = [
    {
      q: `Do you build websites for businesses in ${c.name}?`,
      a: `Yes. ${BRAND.name} builds and runs websites for local businesses right here in ${c.name}, Idaho (${c.zip}) and across ${REGION_NAME}.`,
    },
    {
      q: `Will my site rank in ${c.name}?`,
      a: `Your site is built to target ${c.name}-specific searches, with local copy, your service area, and structured data that helps you show up on Google and in maps.`,
    },
    {
      q: "What does it cost?",
      a: "One simple setup, then a flat monthly fee covering hosting, the buy/booking flow, and the follow-up automation. No per-lead charges.",
    },
  ];

  return (
    <main>
      <JsonLd data={faqJsonLd(faqs)} />

      {/* Hero */}
      <Section className="bg-brand-50/40">
        <Eyebrow>
          {c.name}, Idaho · {c.zip}
        </Eyebrow>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Small business websites in {c.name}, Idaho
        </h1>
        <Lead className="max-w-3xl">{c.blurb}</Lead>
        <p className="mt-4 max-w-3xl text-lg text-ink-soft">
          {BRAND.name} gives {c.name} businesses a fully-built, SEO-optimized
          website with a real buy button and the follow-up automated — then we
          run it for a flat monthly fee.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <CTAButton href="/start">Start my {c.name} site</CTAButton>
          <CTAButton href="/#pricing" variant="ghost">
            See pricing
          </CTAButton>
        </div>
      </Section>

      {/* Local angle */}
      <Section>
        <Eyebrow>Why local matters in {c.name}</Eyebrow>
        <H2>A website built to win customers in {c.name}</H2>
        <Lead>
          Generic sites don't rank locally. Yours is engineered for {c.name}
          {" "}buyers from the first headline to the structured data.
        </Lead>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {LOCAL_ANGLE.map((item) => (
            <Card key={item.title}>
              <h3 className="text-lg font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-ink-soft">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Verticals served */}
      <Section className="bg-brand-50/40">
        <Eyebrow>Trades we serve in {c.name}</Eyebrow>
        <H2>The local businesses we build for in {c.name}</H2>
        <Lead>
          From the first call to the booked job, we build the kind of site each
          of these trades needs to grow in {c.name}.
        </Lead>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VERTICALS.map((v) => (
            <CTAButton
              key={v.slug}
              href={`/websites-for/${v.slug}`}
              variant="ghost"
            >
              <span aria-hidden="true" className="mr-1.5">
                {v.emoji}
              </span>
              {v.name} in {c.name}
            </CTAButton>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <Eyebrow>Questions from {c.name} owners</Eyebrow>
        <H2>What businesses in {c.name} ask</H2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {faqs.map((f) => (
            <Card key={f.q}>
              <h3 className="text-lg font-bold text-ink">{f.q}</h3>
              <p className="mt-2 text-ink-soft">{f.a}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Other cities */}
      <Section className="bg-brand-50/40">
        <Eyebrow>More of {REGION_NAME}</Eyebrow>
        <H2>We build across the valley</H2>
        <div className="mt-8 flex flex-wrap gap-3">
          {otherCities.map((o) => (
            <CTAButton
              key={o.slug}
              href={`/locations/${o.slug}`}
              variant="ghost"
            >
              {o.name}
              <span className="ml-2 inline-flex">
                <Badge>{o.zip}</Badge>
              </span>
            </CTAButton>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section>
        <Card className="bg-brand-600 text-center text-white">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to get found in {c.name}?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-50">
            Answer a few questions and we'll generate your complete,
            SEO-optimized {c.name} website — buy button and follow-up included.
          </p>
          <div className="mt-8 flex justify-center">
            <CTAButton href="/start">Start my {c.name} site</CTAButton>
          </div>
        </Card>
      </Section>
    </main>
  );
}
