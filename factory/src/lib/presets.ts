import type { SiteConfig } from "@/lib/site-config";
import { VERTICALS, verticalBySlug } from "@/lib/verticals";
import { TREASURE_VALLEY } from "@/lib/geo";

/**
 * Starter SiteConfig presets, one per vertical.
 *
 * Onboarding calls `presetFor(verticalSlug)` to PREFILL the wizard with a
 * realistic, conversion-ready draft (business name placeholder, tagline,
 * about copy, three priced services, trust badges, tailored qualifying
 * questions, and the booking mode that fits the vertical). The owner then
 * edits from a working starting point instead of a blank form.
 *
 * Pure data — no JSX. Every returned object satisfies the SiteConfig field
 * shapes so it can be merged into wizard state and parsed by
 * SiteConfigSchema once owner fields are filled in.
 */

/** All Treasure Valley city names — every starter serves the full corridor. */
const ALL_CITIES: string[] = TREASURE_VALLEY.map((c) => c.name);

const PRIMARY_CITY = "Meridian";

/** Sensible defaults shared by every preset. */
const baseAutomation: SiteConfig["automation"] = {
  missedCallTextBack: true,
  aiTriage: true,
  reviewRequest: true,
  qualifyingQuestions: [
    "What's your ZIP code?",
    "What service do you need?",
    "When works best for you?",
  ],
};

const baseTheme: SiteConfig["theme"] = {
  primary: "#1f5af0",
  accent: "#0b1120",
  shape: "rounded",
};

/**
 * Per-vertical starter content. Booking mode comes from the vertical so the
 * preset always matches `vertical.bookingMode`.
 */
const PRESETS: Record<string, Partial<SiteConfig>> = {
  cleaning: {
    vertical: "cleaning",
    businessName: "Valley Fresh Cleaning Co.",
    tagline: "Spotless homes and cleaner air across the Treasure Valley.",
    about:
      "Valley Fresh Cleaning Co. is a locally owned cleaning and air-duct service serving Meridian and the greater Treasure Valley. We send background-checked techs, use upfront flat pricing, and back every job with a satisfaction guarantee — no surprise charges, no ZIP-by-ZIP haggling.",
    theme: { primary: "#0ea5a4", accent: "#0b1120", shape: "rounded" },
    services: [
      {
        name: "Standard Home Clean",
        description:
          "Top-to-bottom clean of kitchens, baths, floors, and living spaces. Perfect for recurring upkeep.",
        price: 149,
        priceUnit: "per visit",
        badge: "Most popular",
        features: ["Kitchen & bathrooms", "Dusting & floors", "Eco-friendly products", "Recurring discounts"],
      },
      {
        name: "Deep Clean",
        description:
          "A detailed reset for move-ins, spring cleaning, or first-time visits — baseboards, inside appliances, and more.",
        price: 299,
        priceUnit: "starting at",
        features: ["Baseboards & vents", "Inside oven & fridge", "Cabinet fronts", "Window sills & tracks"],
      },
      {
        name: "Air Duct Cleaning",
        description:
          "Improve airflow and indoor air quality with a full supply-and-return duct cleaning for the average home.",
        price: 349,
        priceUnit: "flat",
        badge: "Cleaner air",
        features: ["All supply & return vents", "Main trunk lines", "Before & after photos", "HVAC-safe equipment"],
      },
    ],
    trustBadges: ["Licensed", "Bonded", "Insured", "Satisfaction guarantee"],
    automation: {
      ...baseAutomation,
      qualifyingQuestions: [
        "What's your ZIP code?",
        "How many bedrooms and bathrooms?",
        "Standard clean, deep clean, or duct cleaning?",
      ],
    },
  },

  detailing: {
    vertical: "detailing",
    businessName: "Mirror Finish Mobile Detailing",
    tagline: "Showroom-clean cars, detailed at your driveway.",
    about:
      "Mirror Finish is a mobile auto-detailing crew that comes to you anywhere in the Treasure Valley. We bring our own water and power, use professional pads and polishes, and offer tap-once online booking so you never wait on a callback to get your car looking new.",
    theme: { primary: "#1d4ed8", accent: "#0b1120", shape: "rounded" },
    services: [
      {
        name: "Express Detail",
        description:
          "Exterior hand wash, wheel and tire dressing, and a quick interior wipe-down and vacuum.",
        price: 99,
        priceUnit: "starting at",
        features: ["Hand wash & dry", "Wheels & tires", "Interior vacuum", "Windows in & out"],
      },
      {
        name: "Full Interior & Exterior",
        description:
          "Complete inside-and-out detail with shampoo, clay bar, and a protective wax — our most-booked package.",
        price: 229,
        priceUnit: "flat",
        badge: "Most popular",
        features: ["Clay bar & wax", "Carpet & upholstery shampoo", "Leather conditioning", "Engine bay wipe-down"],
      },
      {
        name: "Ceramic Coating",
        description:
          "Multi-year paint protection with a professionally applied ceramic coating and full paint prep.",
        price: 699,
        priceUnit: "starting at",
        badge: "Best protection",
        features: ["Paint decontamination", "Single-stage polish", "3-year ceramic coating", "Hydrophobic finish"],
      },
    ],
    trustBadges: ["Insured", "Mobile service", "5-star rated", "Satisfaction guarantee"],
    automation: {
      ...baseAutomation,
      qualifyingQuestions: [
        "What's your ZIP code?",
        "Year, make, and model of the vehicle?",
        "Which package are you interested in?",
      ],
    },
  },

  furniture: {
    vertical: "furniture",
    businessName: "Treasure Valley Home Furnishings",
    tagline: "Quality furniture you can buy online — financing available.",
    about:
      "Treasure Valley Home Furnishings sells quality new and refurbished pieces with honest, posted prices. Buy online and check out in minutes, choose flexible financing with no perfect credit required, and schedule local delivery anywhere in the valley.",
    theme: { primary: "#b45309", accent: "#1c1917", shape: "rounded" },
    services: [
      {
        name: "Refurbished Sectional",
        description:
          "Inspected, cleaned, and restored sectional sofas in great condition — styles and colors rotate weekly.",
        price: 899,
        priceUnit: "starting at",
        badge: "Most popular",
        features: ["Professionally cleaned", "30-day guarantee", "Local delivery available", "Financing eligible"],
      },
      {
        name: "Dining Set",
        description:
          "Solid table-and-chairs sets ready for everyday use — seats four to six depending on the piece.",
        price: 549,
        priceUnit: "starting at",
        features: ["Solid construction", "Seats 4–6", "Mix-and-match chairs", "Financing eligible"],
      },
      {
        name: "Bedroom Package",
        description:
          "Complete bedroom bundle with bed frame, dresser, and nightstand at a packaged price.",
        price: 1199,
        priceUnit: "flat",
        badge: "Best value",
        features: ["Frame, dresser & nightstand", "Matching finish", "Local delivery available", "0% intro financing"],
      },
    ],
    trustBadges: ["Financing available", "30-day guarantee", "Local delivery", "Family owned"],
    booking: {
      mode: "checkout",
      depositPercent: 0,
      financing: true,
    },
    automation: {
      ...baseAutomation,
      qualifyingQuestions: [
        "What's your ZIP code for delivery?",
        "Which piece are you interested in?",
        "Do you want to apply for financing?",
      ],
    },
  },

  lawn: {
    vertical: "lawn",
    businessName: "Green Valley Lawn & Landscape",
    tagline: "Dependable lawn care that keeps your yard the best on the block.",
    about:
      "Green Valley Lawn & Landscape handles mowing, cleanups, and seasonal service across the Treasure Valley. Request a fast quote and we respond same day — even in the spring rush — so your yard never falls behind while you wait on a callback.",
    theme: { primary: "#15803d", accent: "#14532d", shape: "rounded" },
    services: [
      {
        name: "Weekly Mowing",
        description:
          "Cut, edge, trim, and blow-down on a reliable weekly schedule for the average Treasure Valley lot.",
        price: 45,
        priceUnit: "per visit",
        badge: "Most popular",
        features: ["Mow, edge & trim", "Blow-down included", "Weekly or biweekly", "Same crew each time"],
      },
      {
        name: "Spring / Fall Cleanup",
        description:
          "Full-property cleanup with leaf removal, bed cleanup, and debris haul-off to reset your yard each season.",
        price: 199,
        priceUnit: "starting at",
        features: ["Leaf removal", "Bed & border cleanup", "Debris haul-off", "Edging refresh"],
      },
      {
        name: "Sprinkler Blowout",
        description:
          "Winterize your irrigation system with a complete compressed-air blowout to prevent freeze damage.",
        price: 75,
        priceUnit: "flat",
        badge: "Seasonal",
        features: ["All zones cleared", "Backflow protected", "Commercial compressor", "Freeze-damage prevention"],
      },
    ],
    trustBadges: ["Licensed", "Insured", "Locally owned", "Free quotes"],
    booking: {
      mode: "lead",
      depositPercent: 0,
      financing: false,
    },
    automation: {
      ...baseAutomation,
      qualifyingQuestions: [
        "What's your ZIP code?",
        "What's the approximate size of your yard?",
        "Which service are you requesting?",
      ],
    },
  },

  "junk-removal": {
    vertical: "junk-removal",
    businessName: "Valley Haul Junk Removal",
    tagline: "Same-day junk removal — we load it, haul it, and sweep up.",
    about:
      "Valley Haul Junk Removal clears out garages, estates, construction debris, and single bulky items across the Treasure Valley. Book a window online, get an upfront flat price by volume, and let our insured crew do all the lifting — often same day.",
    theme: { primary: "#ea580c", accent: "#0b1120", shape: "rounded" },
    services: [
      {
        name: "Single Item Pickup",
        description:
          "One bulky item — couch, mattress, appliance, or hot tub cover — removed and responsibly disposed.",
        price: 99,
        priceUnit: "starting at",
        features: ["We do the lifting", "Responsible disposal", "Same-day available", "No hidden fees"],
      },
      {
        name: "Half-Truck Load",
        description:
          "About half a truck of mixed junk — perfect for a garage corner, small cleanout, or yard debris.",
        price: 299,
        priceUnit: "flat",
        badge: "Most popular",
        features: ["~6 cubic yards", "Labor included", "Sweep-up included", "Upfront pricing"],
      },
      {
        name: "Full-Truck Load",
        description:
          "A full truckload for whole-room, estate, or construction cleanouts — the most we can fit in one trip.",
        price: 549,
        priceUnit: "flat",
        badge: "Best value",
        features: ["~12 cubic yards", "Crew of two", "Donation drop-off when possible", "Sweep-up included"],
      },
    ],
    trustBadges: ["Insured", "Same-day service", "Upfront pricing", "Eco-friendly disposal"],
    automation: {
      ...baseAutomation,
      qualifyingQuestions: [
        "What's your ZIP code?",
        "Roughly how much junk — one item, half a truck, or a full truck?",
        "How soon do you need it gone?",
      ],
    },
  },

  handyman: {
    vertical: "handyman",
    businessName: "Treasure Valley Handyman Services",
    tagline: "One call for the home repairs on your to-do list.",
    about:
      "Treasure Valley Handyman Services tackles the repairs and small projects most contractors won't bother with — mounting, assembly, drywall, fixtures, and the honey-do list. Send us your project and we'll respond fast with a clear, upfront quote.",
    theme: { primary: "#1f5af0", accent: "#0b1120", shape: "rounded" },
    services: [
      {
        name: "TV Mounting",
        description:
          "Professional wall mount with level placement and tidy cable management for most TV sizes.",
        price: 129,
        priceUnit: "starting at",
        badge: "Most popular",
        features: ["Secure stud mounting", "Cable management", "Most TV sizes", "Bracket guidance"],
      },
      {
        name: "Furniture & Fixture Assembly",
        description:
          "Flat-pack furniture, shelving, and fixture installs assembled correctly the first time.",
        price: 89,
        priceUnit: "starting at",
        features: ["Flat-pack furniture", "Shelving & racks", "Light fixtures", "Hauled-away packaging"],
      },
      {
        name: "Handyman Half-Day",
        description:
          "Four hours of on-site labor to knock out multiple small repairs from your to-do list in one visit.",
        price: 349,
        priceUnit: "flat",
        badge: "Best value",
        features: ["4 hours of labor", "Multiple tasks", "Drywall & patchwork", "Upfront quote"],
      },
    ],
    trustBadges: ["Licensed", "Insured", "Upfront quotes", "Locally owned"],
    booking: {
      mode: "lead",
      depositPercent: 0,
      financing: false,
    },
    automation: {
      ...baseAutomation,
      qualifyingQuestions: [
        "What's your ZIP code?",
        "What do you need done?",
        "When would you like it scheduled?",
      ],
    },
  },
};

/** Slugs of every vertical that has a starter preset. */
export const PRESET_SLUGS: string[] = VERTICALS.map((v) => v.slug);

/**
 * Returns a sensible STARTER SiteConfig for the given vertical, used by
 * onboarding to prefill the wizard. Falls back to a generic starter if the
 * slug is unknown. The booking mode always matches the vertical's
 * `bookingMode`; cities/primaryCity/theme/automation are filled with sane
 * shared defaults the owner can override.
 */
export function presetFor(verticalSlug: string): Partial<SiteConfig> {
  const vertical = verticalBySlug(verticalSlug);
  const preset = PRESETS[verticalSlug];

  const resolvedSlug = vertical?.slug ?? verticalSlug;
  const bookingMode: SiteConfig["booking"]["mode"] = vertical?.bookingMode ?? "lead";

  const booking: SiteConfig["booking"] = preset?.booking
    ? { ...preset.booking, mode: bookingMode }
    : {
        mode: bookingMode,
        depositPercent: bookingMode === "booking" ? 25 : 0,
        financing: false,
      };

  if (!preset) {
    // Unknown vertical — return a safe generic starter.
    return {
      vertical: resolvedSlug,
      businessName: "Your Business Name",
      tagline: "Trusted local service across the Treasure Valley.",
      about:
        "Tell customers who you are, what you do, and why locals trust you. This is your chance to build confidence before they reach out.",
      citiesServed: ALL_CITIES,
      primaryCity: PRIMARY_CITY,
      theme: { ...baseTheme },
      services: [
        {
          name: "Service One",
          description: "Describe your most popular service and what's included.",
          price: 149,
          priceUnit: "starting at",
          badge: "Most popular",
          features: ["Feature one", "Feature two", "Feature three"],
        },
      ],
      reviews: [],
      booking,
      automation: { ...baseAutomation },
      trustBadges: ["Licensed", "Insured", "Locally owned"],
      plan: "growth",
    };
  }

  return {
    ...preset,
    vertical: resolvedSlug,
    citiesServed: ALL_CITIES,
    primaryCity: PRIMARY_CITY,
    theme: preset.theme ?? { ...baseTheme },
    reviews: preset.reviews ?? [],
    booking,
    automation: preset.automation ?? { ...baseAutomation },
    trustBadges: preset.trustBadges ?? ["Licensed", "Insured", "Locally owned"],
    plan: preset.plan ?? "growth",
  };
}
