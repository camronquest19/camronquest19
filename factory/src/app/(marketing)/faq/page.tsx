import { pageMetadata, faqJsonLd, JsonLd } from "@/lib/seo";
import { BRAND } from "@/config/brand";
import { Section, Eyebrow, H2, Lead, CTAButton } from "@/components/ui";

export const metadata = pageMetadata({
  title: "FAQ — Pricing, ownership, domains, SEO & cancellation",
  description:
    "Straight answers for local business owners: what it costs, whether you own your site, using your own domain, how fast you go live, SEO and Google Business Profile, cancellation, and financing for your customers.",
  path: "/faq",
});

const FAQS: { q: string; a: string }[] = [
  {
    q: "How much does it cost?",
    a: `${BRAND.name} is a flat monthly fee with no big upfront build bill. You pick Starter, Growth, or Pro on the pricing page, and that covers the site, hosting, SEO, the buy button, and the automation we run for you. Cancel any time.`,
  },
  {
    q: "Do I own my website?",
    a: "Yes. Your content, brand, photos, copy, and customer data are yours. The site is built and operated by us as part of your subscription, and if you ever leave we hand over your content and point your domain wherever you want.",
  },
  {
    q: "Can I use my own domain?",
    a: "Absolutely. Bring your existing domain and we’ll connect it, or grab a new one — we’ll handle the setup either way. Your site runs on your domain, not a sub-page of ours.",
  },
  {
    q: "How fast can I go live?",
    a: "Most owners go live the same day. You pick your business type, self-onboard your info, photos, services, and prices in about 10–15 minutes, and we publish. SEO and your service-area pages are live immediately.",
  },
  {
    q: "Is the site actually good for SEO?",
    a: `Yes — that’s the whole point. Every site is fast, mobile-first, and built with structured data and a dedicated page for each city you serve in ${BRAND.region}. We target the exact terms your customers search, like “near me” and city-specific queries.`,
  },
  {
    q: "Do you handle my Google Business Profile?",
    a: "On Growth and Pro plans we help optimize and keep your Google Business Profile aligned with your site, and our automated review requests feed it 5-star reviews after each job so you rank and convert better locally.",
  },
  {
    q: "What is the automation you keep mentioning?",
    a: "Three things that win local jobs: missed-call text-back so no lead is lost when you can’t pick up, AI triage that qualifies and routes new inquiries with your own questions, and automatic review requests after the work is done.",
  },
  {
    q: "Can customers actually pay or book online?",
    a: "Yes. Every site has a real buy button or booking flow. Depending on your business, customers can book a slot, pay in full, or leave a deposit online — so jobs are locked in before you ever pick up the phone.",
  },
  {
    q: "Do you offer financing for my customers?",
    a: "For higher-ticket services we can enable customer financing at checkout, so your buyers can split the cost into payments while you still get paid up front. It’s a toggle on your services during onboarding.",
  },
  {
    q: "What if I already have a website?",
    a: "No problem. We’ll rebuild it faster, cleaner, and SEO-optimized, then either replace it on your existing domain or run alongside it during the switch. You keep your content; we upgrade the engine and add the buy button and automation.",
  },
  {
    q: "What happens if I want to cancel?",
    a: "There are no long contracts. Cancel any time from your account. We’ll export your content and hand off your domain. No penalties, no hostage-taking.",
  },
  {
    q: "Do I need to be technical or design anything?",
    a: "Not at all. You fill in a guided form — your business name, services, prices, and a few photos — and we generate and run the whole site. If you can text, you can launch.",
  },
];

export default function FaqPage() {
  return (
    <Section>
      <JsonLd data={faqJsonLd(FAQS)} />
      <div className="max-w-2xl">
        <Eyebrow>FAQ</Eyebrow>
        <H2>Questions, answered straight</H2>
        <Lead>
          The stuff local business owners actually ask before they sign up. Don’t see yours?
          Email {BRAND.email} or call {BRAND.phone}.
        </Lead>
      </div>

      <dl className="mt-12 divide-y divide-slate-200 border-t border-slate-200">
        {FAQS.map((f) => (
          <div key={f.q} className="py-6">
            <dt className="text-lg font-bold text-ink">{f.q}</dt>
            <dd className="mt-2 text-ink-soft">{f.a}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 flex flex-wrap gap-3">
        <CTAButton href="/start">Start onboarding</CTAButton>
        <CTAButton href="/pricing" variant="ghost">
          See pricing
        </CTAButton>
      </div>
    </Section>
  );
}
