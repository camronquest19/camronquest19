/**
 * GEO targeting data for the Treasure Valley corridor.
 * Drives the per-city landing pages on both the storefront and generated sites.
 */
export interface City {
  name: string;
  slug: string;
  zip: string;
  blurb: string;
}

export const TREASURE_VALLEY: City[] = [
  { name: "Meridian", slug: "meridian", zip: "83642", blurb: "Idaho's fastest-growing city — affluent, family-heavy, full of new-construction move-ins." },
  { name: "Boise", slug: "boise", zip: "83702", blurb: "The metro anchor; high search volume and the densest local demand in the valley." },
  { name: "Eagle", slug: "eagle", zip: "83616", blurb: "The high end of the corridor — older, wealthier homeowners who invest in their spaces." },
  { name: "Nampa", slug: "nampa", zip: "83651", blurb: "The valley's second-largest city; value-conscious and fast-growing." },
  { name: "Caldwell", slug: "caldwell", zip: "83605", blurb: "Top year-over-year population gainer in the corridor." },
  { name: "Kuna", slug: "kuna", zip: "83634", blurb: "A boomtown suburb growing double digits a year." },
  { name: "Star", slug: "star", zip: "83669", blurb: "One of the fastest-growing small towns in Idaho." },
];

export const REGION_NAME = "the Treasure Valley";

export function cityBySlug(slug: string): City | undefined {
  return TREASURE_VALLEY.find((c) => c.slug === slug);
}
