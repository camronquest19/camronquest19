import { z } from "zod";

/**
 * SiteConfig is the heart of the factory.
 *
 * - The onboarding wizard PRODUCES one of these from owner input.
 * - The template engine CONSUMES one to render a complete, SEO/GEO-optimized
 *   local-business site (hero, services, pricing, buy button, booking, reviews,
 *   about, contact, footer) plus the automation hooks from the playbook.
 *
 * Everything that differs between two customers' sites lives in here. The
 * renderer never hard-codes a business detail — it only reads this object.
 */

export const ServiceSchema = z.object({
  name: z.string(),
  description: z.string(),
  /** Flat price in whole dollars. Posted prices convert — see playbook. */
  price: z.number().int().nonnegative(),
  /** e.g. "per visit", "starting at", "per room". */
  priceUnit: z.string().default("flat"),
  /** Optional fast badge: "Most popular", "Same-day". */
  badge: z.string().optional(),
  features: z.array(z.string()).default([]),
});
export type Service = z.infer<typeof ServiceSchema>;

export const ReviewSchema = z.object({
  author: z.string(),
  rating: z.number().min(1).max(5).default(5),
  text: z.string(),
  city: z.string().optional(),
});
export type Review = z.infer<typeof ReviewSchema>;

export const ThemeSchema = z.object({
  /** Tailwind-friendly hex; the renderer injects these as CSS vars. */
  primary: z.string().default("#1f5af0"),
  accent: z.string().default("#0b1120"),
  /** "rounded" | "sharp" affects card/button radius. */
  shape: z.enum(["rounded", "sharp"]).default("rounded"),
});
export type Theme = z.infer<typeof ThemeSchema>;

export const BookingSchema = z.object({
  /** "checkout" = pay online now; "booking" = book a slot + deposit; "lead" = capture + auto-reply. */
  mode: z.enum(["checkout", "booking", "lead"]).default("booking"),
  /** External booking/checkout URL if the owner already has one. */
  externalUrl: z.string().url().optional(),
  /** Deposit percent required at booking (0-100). */
  depositPercent: z.number().min(0).max(100).default(25),
  financing: z.boolean().default(false),
});
export type Booking = z.infer<typeof BookingSchema>;

export const AutomationSchema = z.object({
  /** Instant text-back on missed call / new lead. */
  missedCallTextBack: z.boolean().default(true),
  /** AI triage drafts a qualified reply (ZIP / budget / timeline). */
  aiTriage: z.boolean().default(true),
  /** Auto review request +1 day after the job. */
  reviewRequest: z.boolean().default(true),
  /** The 2-3 qualifying questions, per the playbook. */
  qualifyingQuestions: z.array(z.string()).default([
    "What's your ZIP code?",
    "What service do you need?",
    "When works best for you?",
  ]),
});
export type Automation = z.infer<typeof AutomationSchema>;

export const SiteConfigSchema = z.object({
  /** URL-safe slug; the generated site lives at /sites/<slug>. */
  slug: z.string().regex(/^[a-z0-9-]+$/),
  vertical: z.string(),
  businessName: z.string(),
  tagline: z.string(),
  about: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  /** Cities served — drives the GEO landing pages on the generated site. */
  citiesServed: z.array(z.string()).min(1),
  primaryCity: z.string(),
  logoUrl: z.string().optional(),
  heroImageUrl: z.string().optional(),
  theme: ThemeSchema.default({}),
  services: z.array(ServiceSchema).min(1),
  reviews: z.array(ReviewSchema).default([]),
  booking: BookingSchema.default({}),
  automation: AutomationSchema.default({}),
  /** Trust badges: "Licensed", "Bonded", "Insured", "30-day guarantee". */
  trustBadges: z.array(z.string()).default([]),
  /** Subscription tier the owner is on. */
  plan: z.enum(["starter", "growth", "pro"]).default("growth"),
});
export type SiteConfig = z.infer<typeof SiteConfigSchema>;

/** Parse + fill defaults; throws on invalid input (used by onboarding). */
export function parseSiteConfig(input: unknown): SiteConfig {
  return SiteConfigSchema.parse(input);
}

/** Best-effort parse for partial wizard state. */
export function safeParseSiteConfig(input: unknown) {
  return SiteConfigSchema.safeParse(input);
}
