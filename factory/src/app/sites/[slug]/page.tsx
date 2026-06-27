import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSite, listSiteSlugs } from "@/data/sites";
import { pageMetadata, localBusinessJsonLd, JsonLd } from "@/lib/seo";
import { TenantSite } from "@/components/template/TenantSite";
import { siteUrl } from "@/config/brand";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return listSiteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = getSite(slug);
  if (!config) {
    return pageMetadata({
      title: "Site not found",
      description: "This business site could not be found.",
      path: `/sites/${slug}`,
      noindex: true,
    });
  }
  return pageMetadata({
    title: `${config.businessName} — ${config.primaryCity}, ID`,
    description: config.tagline,
    path: `/sites/${config.slug}`,
    image: config.heroImageUrl,
  });
}

export default async function TenantSitePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const config = getSite(slug);
  if (!config) notFound();

  const reviewCount = config.reviews.length;
  const ratingValue =
    reviewCount > 0
      ? Math.round(
          (config.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10,
        ) / 10
      : undefined;

  const jsonLd = localBusinessJsonLd({
    name: config.businessName,
    description: config.tagline,
    phone: config.phone,
    cities: config.citiesServed,
    url: `${siteUrl}/sites/${config.slug}`,
    reviewCount: reviewCount || undefined,
    ratingValue,
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <TenantSite config={config} />
    </>
  );
}
