import { BRAND } from "@/config/brand";
import { CTAButton, Section, Eyebrow, H2, Lead } from "@/components/ui";
import { JsonLd, organizationJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <main>
      <JsonLd data={organizationJsonLd()} />
      <Section className="bg-gradient-to-b from-brand-50 to-white">
        <Eyebrow>{BRAND.region}</Eyebrow>
        <H2 className="max-w-3xl !text-5xl">{BRAND.tagline}</H2>
        <Lead>{BRAND.pitch}</Lead>
        <div className="mt-8 flex flex-wrap gap-3">
          <CTAButton href="/start">Build my site →</CTAButton>
          <CTAButton href="/pricing" variant="ghost">See pricing</CTAButton>
        </div>
      </Section>
    </main>
  );
}
