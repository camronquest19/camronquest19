import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BRAND } from "@/config/brand";
import { Section, Eyebrow, H2, Lead, CTAButton, Card } from "@/components/ui";

export const metadata = pageMetadata({
  title: "How It Works — From sign-up to a money-making site in minutes",
  description:
    "Pick your business type and plan, self-onboard your info, photos, services and prices in minutes, then go live with an SEO site, a real buy button, and follow-up automation we run for you every month.",
  path: "/how-it-works",
});

interface Step {
  n: number;
  title: string;
  lead: string;
  points: string[];
}

const STEPS: Step[] = [
  {
    n: 1,
    title: "Pick your business type + plan",
    lead: "Tell us what you do. We already know what your customers in the Treasure Valley search for.",
    points: [
      "Choose your vertical — cleaning, detailing, lawn care, HVAC, and more.",
      "We load a starter site pre-tuned for your industry’s buyers and keywords.",
      "Pick Starter, Growth, or Pro. One flat monthly fee, no surprise build bill.",
    ],
  },
  {
    n: 2,
    title: "Self-onboard your info, photos, services & prices",
    lead: "A guided form, not a blank canvas. Most owners finish in well under 15 minutes.",
    points: [
      "Drop in your business name, cities served, phone, and a short about.",
      "Upload photos or use our defaults — your logo and hero image are optional.",
      "List your services with real prices so customers can buy or book on the spot.",
      "Paste your reviews and trust badges. Preview the live site as you type.",
    ],
  },
  {
    n: 3,
    title: "Go live — SEO site + buy button + automation",
    lead: "We publish, point search engines at it, and turn on the follow-up that wins the job.",
    points: [
      "A fast, SEO-optimized site for every city you serve goes live.",
      "A real buy button or booking flow takes deposits and payments online.",
      "We run it monthly — updates, monitoring, and the automation below.",
    ],
  },
];

interface Auto {
  emoji: string;
  title: string;
  body: string;
}

const AUTOMATIONS: Auto[] = [
  {
    emoji: "📲",
    title: "Missed-call text-back",
    body: "Every call you can’t answer gets an instant text so the lead never goes to the competitor who picked up first.",
  },
  {
    emoji: "🤖",
    title: "AI triage",
    body: "New inquiries are read, qualified with your questions, and routed — hot jobs surface first, tire-kickers get handled automatically.",
  },
  {
    emoji: "⭐",
    title: "Review requests",
    body: "After the job, customers get a friendly nudge to leave a 5-star review, so your reputation compounds without you chasing it.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Section>
        <Eyebrow>How it works</Eyebrow>
        <H2>From sign-up to a site that sells in minutes</H2>
        <Lead>
          {BRAND.name} is the fast-food of local business websites. You bring the business —
          we bring the build, the SEO, the buy button, and the follow-up. Here’s exactly how it
          goes, start to finish.
        </Lead>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {STEPS.map((step) => (
            <Card key={step.n} className="flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-xl font-extrabold text-white">
                {step.n}
              </div>
              <h3 className="mt-5 text-xl font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-ink-soft">{step.lead}</p>
              <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                {step.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden className="mt-0.5 text-brand-600">
                      ✓
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-brand-50">
        <div className="max-w-2xl">
          <Eyebrow>What we automate for you</Eyebrow>
          <H2>The follow-up runs itself</H2>
          <Lead>
            Most local jobs are won in the first five minutes. We turn on the automation that
            captures and closes leads while you’re on a ladder, under a sink, or driving to the
            next stop.
          </Lead>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {AUTOMATIONS.map((a) => (
            <Card key={a.title}>
              <div className="text-3xl" aria-hidden>
                {a.emoji}
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">{a.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{a.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <Card className="flex flex-col items-start gap-6 bg-brand-900 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Ready to launch in {BRAND.region}?
            </h2>
            <p className="mt-2 max-w-xl text-brand-100">
              Pick your business type, fill in your details, and watch your site come to life as
              you type. You can go live today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CTAButton href="/start">Start onboarding</CTAButton>
            <Link
              href="/pricing"
              className="btn-ghost border border-white/30 text-white hover:bg-white/10"
            >
              See pricing
            </Link>
          </div>
        </Card>
      </Section>
    </>
  );
}
