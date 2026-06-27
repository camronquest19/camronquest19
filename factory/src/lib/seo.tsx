import type { Metadata } from "next";
import { BRAND, siteUrl } from "@/config/brand";

interface PageSeo {
  title: string;
  description: string;
  path?: string;
  /** Override OG image; defaults to the brand OG. */
  image?: string;
  noindex?: boolean;
}

/** Build consistent, SEO-complete metadata for any page. */
export function pageMetadata({ title, description, path = "/", image, noindex }: PageSeo): Metadata {
  const url = `${siteUrl}${path}`;
  // When no explicit image is given, omit images so Next's generated
  // opengraph-image convention (src/app/opengraph-image.tsx) supplies one.
  const images = image ? [{ url: image, width: 1200, height: 630 }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: BRAND.name,
      type: "website",
      ...(images ? { images } : {}),
    },
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image] } : {}) },
  };
}

/** Organization + WebSite JSON-LD for the storefront root. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.name,
    url: siteUrl,
    description: BRAND.pitch,
    email: BRAND.email,
    telephone: BRAND.phone,
    areaServed: BRAND.region,
    sameAs: [BRAND.social.facebook, BRAND.social.instagram],
  };
}

/** LocalBusiness JSON-LD for a generated tenant site (drives GEO ranking). */
export function localBusinessJsonLd(args: {
  name: string;
  description: string;
  phone: string;
  cities: string[];
  url: string;
  reviewCount?: number;
  ratingValue?: number;
}) {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: args.name,
    description: args.description,
    telephone: args.phone,
    url: args.url,
    areaServed: args.cities.map((name) => ({ "@type": "City", name })),
  };
  if (args.reviewCount && args.ratingValue) {
    base.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: args.ratingValue,
      reviewCount: args.reviewCount,
    };
  }
  return base;
}

/** FAQPage JSON-LD — wins rich snippets on the storefront. */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Inline JSON-LD <script> helper. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
