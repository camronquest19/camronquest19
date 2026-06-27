export type PlanId = "starter" | "growth" | "pro";

export interface Plan {
  id: PlanId;
  name: string;
  priceMonthly: number;
  tagline: string;
  features: string[];
  highlighted?: boolean;
  /** Name of the env var that holds the Stripe recurring price id for this plan. */
  stripePriceEnv: string;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 99,
    tagline: "Get found and get booked.",
    features: [
      "Fully built local-business website",
      "Fast, secure hosting included",
      "Mobile-first, conversion-focused design",
      "Online “Buy” / deposit button",
      "Click-to-call + contact form",
      "Google-ready basic SEO",
    ],
    stripePriceEnv: "STRIPE_PRICE_STARTER",
  },
  {
    id: "growth",
    name: "Growth",
    priceMonthly: 199,
    tagline: "Win more jobs across the Treasure Valley.",
    highlighted: true,
    features: [
      "Everything in Starter",
      "Local SEO + GEO city landing pages",
      "Missed-call text-back automation",
      "AI lead triage & qualifying questions",
      "Automated review-request engine",
      "Booking / lead capture workflows",
    ],
    stripePriceEnv: "STRIPE_PRICE_GROWTH",
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 399,
    tagline: "Scale with ads and multi-location.",
    features: [
      "Everything in Growth",
      "Done-for-you paid ads management",
      "Priority support & faster changes",
      "Multi-location / multi-service-area",
      "Advanced conversion tracking",
      "Quarterly growth strategy review",
    ],
    stripePriceEnv: "STRIPE_PRICE_PRO",
  },
];

export function planById(id: PlanId): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
