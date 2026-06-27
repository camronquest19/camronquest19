import { parseSiteConfig, type SiteConfig } from "@/lib/site-config";

/**
 * Seed tenant sites. In production this is a Postgres table keyed by slug;
 * the data layer below is the single access point so swapping the store later
 * touches nothing in the renderer.
 *
 * The first seed is the "after" version of the duct-cleaning business from the
 * playbook worked example — the manual Facebook-DM operator, productized.
 */
const SEEDS: SiteConfig[] = [
  parseSiteConfig({
    slug: "valley-fresh-air",
    vertical: "cleaning",
    businessName: "Valley Fresh Air Duct Cleaning",
    tagline: "Breathe cleaner air — book your duct cleaning online in 60 seconds.",
    about:
      "Family-run, licensed, bonded, and insured. We send before-and-after photos of every job so you see exactly what you paid for. Pay after the service — your satisfaction comes first.",
    phone: "(208) 555-0118",
    email: "book@valleyfreshair.com",
    citiesServed: ["Meridian", "Boise", "Eagle", "Nampa", "Caldwell"],
    primaryCity: "Meridian",
    trustBadges: ["Licensed", "Bonded", "Insured", "Satisfaction guaranteed"],
    theme: { primary: "#0e9f6e", accent: "#0b1120", shape: "rounded" },
    services: [
      { name: "Up to 10 vents", description: "Full clean of up to 10 vents + main trunk lines.", price: 199, priceUnit: "flat", features: ["Before/after photos", "Same-week scheduling"] },
      { name: "11–20 vents", description: "Whole-floor clean for larger homes.", price: 299, priceUnit: "flat", badge: "Most popular", features: ["Before/after photos", "Sanitizing fog add-on available"] },
      { name: "Whole-home + dryer vent", description: "Every vent plus dryer-vent clean-out (fire-safety).", price: 399, priceUnit: "flat", features: ["Before/after photos", "Dryer vent included", "Priority scheduling"] },
    ],
    reviews: [
      { author: "Roberta M.", rating: 5, text: "Showed up on time, photos were eye-opening. House smells fresh.", city: "Boise" },
      { author: "Dwayne T.", rating: 5, text: "Booked online at 11pm, confirmed instantly. So easy.", city: "Meridian" },
    ],
    booking: { mode: "booking", depositPercent: 25, financing: false },
    automation: {
      missedCallTextBack: true,
      aiTriage: true,
      reviewRequest: true,
      qualifyingQuestions: ["What's your ZIP code?", "How many vents / how big is your home?", "When works best for you?"],
    },
    plan: "growth",
  }),
  parseSiteConfig({
    slug: "treasure-valley-sectionals",
    vertical: "furniture",
    businessName: "Treasure Valley Sectional Depot",
    tagline: "Refurbished designer sectionals — see it, finance it, get it delivered.",
    about:
      "We source, inspect, and refurbish designer sectionals (Thomasville, West Elm, Pottery Barn, Crate & Barrel) and deliver them across the Treasure Valley. Real photos, posted prices, 30-day guarantee.",
    phone: "(208) 555-0199",
    email: "sales@boise-sectionals.com",
    citiesServed: ["Meridian", "Boise", "Eagle", "Nampa", "Caldwell"],
    primaryCity: "Boise",
    trustBadges: ["Inspected & refurbished", "30-day guarantee", "Local delivery", "Financing available"],
    theme: { primary: "#1f5af0", accent: "#0b1120", shape: "rounded" },
    services: [
      { name: "Leather sectional", description: "Refurbished top-grain leather, like-new.", price: 1200, priceUnit: "starting at", features: ["Free Meridian/Eagle delivery", "Snap Finance"] },
      { name: "Fabric sectional", description: "Deep-cleaned designer fabric sectionals.", price: 800, priceUnit: "starting at", badge: "Most popular", features: ["Free local delivery", "Financing"] },
      { name: "Sleeper sectional", description: "Pull-out designer sleepers for guests.", price: 1400, priceUnit: "starting at", features: ["White-glove delivery"] },
    ],
    reviews: [
      { author: "Megan K.", rating: 5, text: "Half the price of new and looks flawless. Delivery was a breeze.", city: "Eagle" },
    ],
    booking: { mode: "checkout", depositPercent: 0, financing: true },
    automation: {
      missedCallTextBack: true,
      aiTriage: true,
      reviewRequest: true,
      qualifyingQuestions: ["What's your ZIP code?", "Which sectional are you interested in?", "Do you want financing?"],
    },
    plan: "pro",
  }),
];

const store = new Map<string, SiteConfig>(SEEDS.map((s) => [s.slug, s]));

export function getAllSites(): SiteConfig[] {
  return Array.from(store.values());
}

export function getSite(slug: string): SiteConfig | undefined {
  return store.get(slug);
}

export function listSiteSlugs(): string[] {
  return Array.from(store.keys());
}
