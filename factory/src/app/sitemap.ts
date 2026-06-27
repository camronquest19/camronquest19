import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/brand";
import { VERTICALS } from "@/lib/verticals";
import { TREASURE_VALLEY } from "@/lib/geo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/pricing", "/how-it-works", "/templates", "/faq", "/start"];
  const now = new Date();
  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${siteUrl}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.8,
  }));
  for (const v of VERTICALS) {
    entries.push({ url: `${siteUrl}/websites-for/${v.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 });
  }
  for (const c of TREASURE_VALLEY) {
    entries.push({ url: `${siteUrl}/locations/${c.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });
  }
  return entries;
}
