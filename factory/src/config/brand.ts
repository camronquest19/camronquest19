/**
 * Single source of truth for the product's own brand.
 * Rename here to rebrand the whole storefront.
 */
export const BRAND = {
  name: "LaunchLocal",
  tagline: "The fast-food of end-to-end local business websites.",
  // The one-liner pitch used across SEO + hero.
  pitch:
    "One click gives any local business a fully-built, SEO-optimized website with a real buy button and the follow-up automated — then we run it for a flat monthly fee.",
  domain: "launchlocal.example.com",
  email: "hello@launchlocal.example.com",
  phone: "(208) 555-0142",
  region: "the Treasure Valley, Idaho",
  foundedYear: 2026,
  social: {
    facebook: "https://facebook.com/launchlocal",
    instagram: "https://instagram.com/launchlocal",
  },
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  `https://${BRAND.domain}`;
