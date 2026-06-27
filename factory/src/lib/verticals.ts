import type { SiteConfig } from "./site-config";

/**
 * The "menu" of business types LaunchLocal sells templates for.
 * Each vertical powers an SEO landing page on the storefront and seeds a
 * starter SiteConfig the owner customizes during onboarding.
 */
export interface Vertical {
  slug: string;
  name: string;
  /** Plural noun for headlines: "cleaning companies". */
  plural: string;
  emoji: string;
  /** What their customers search — used on the SEO landing page. */
  searchTerms: string[];
  /** The pain this vertical feels, in the owner's words. */
  pain: string;
  /** Default booking mode that fits the vertical. */
  bookingMode: SiteConfig["booking"]["mode"];
}

export const VERTICALS: Vertical[] = [
  {
    slug: "cleaning",
    name: "Cleaning & duct service",
    plural: "cleaning companies",
    emoji: "🧹",
    searchTerms: ["air duct cleaning near me", "house cleaning meridian id", "carpet cleaning boise"],
    pain: "You're quoting ZIP-by-ZIP in Facebook DMs and losing the after-hours leads.",
    bookingMode: "booking",
  },
  {
    slug: "detailing",
    name: "Auto detailing",
    plural: "detailers",
    emoji: "🚗",
    searchTerms: ["mobile detailing boise", "ceramic coating meridian", "car detail near me"],
    pain: "No online booking means buyers pick the competitor who lets them tap once.",
    bookingMode: "booking",
  },
  {
    slug: "furniture",
    name: "Furniture & resale",
    plural: "furniture sellers",
    emoji: "🛋️",
    searchTerms: ["used sectional boise", "refurbished furniture meridian", "couch financing no credit"],
    pain: "Every sale is a phone call — nobody can just buy from you online.",
    bookingMode: "checkout",
  },
  {
    slug: "lawn",
    name: "Lawn & landscaping",
    plural: "lawn care pros",
    emoji: "🌱",
    searchTerms: ["lawn care nampa", "landscaping boise", "sprinkler blowout meridian"],
    pain: "Seasonal demand spikes and you can't keep up with the quote requests.",
    bookingMode: "lead",
  },
  {
    slug: "junk-removal",
    name: "Junk removal & hauling",
    plural: "junk removal crews",
    emoji: "🚛",
    searchTerms: ["junk removal boise", "furniture removal caldwell", "haul away meridian"],
    pain: "Urgent jobs go to whoever answers first — and you can't always answer.",
    bookingMode: "booking",
  },
  {
    slug: "handyman",
    name: "Handyman & home services",
    plural: "handymen",
    emoji: "🔧",
    searchTerms: ["handyman near me", "home repair boise", "tv mounting meridian"],
    pain: "You're great at the work but invisible online when people search.",
    bookingMode: "lead",
  },
];

export function verticalBySlug(slug: string): Vertical | undefined {
  return VERTICALS.find((v) => v.slug === slug);
}
