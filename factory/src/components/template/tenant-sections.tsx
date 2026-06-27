import type { ReactNode } from "react";
import type { Service, Review } from "@/lib/site-config";

/** Render a whole-dollar price like "$199". */
export function formatPrice(price: number): string {
  return `$${Math.round(price).toLocaleString("en-US")}`;
}

/** The verb shown on buy/book buttons, derived from booking.mode. */
export function ctaLabel(mode: "checkout" | "booking" | "lead"): string {
  switch (mode) {
    case "checkout":
      return "Buy now";
    case "booking":
      return "Book now";
    case "lead":
    default:
      return "Get a quote";
  }
}

/** Pill used for trust badges + service-area chips. */
export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-ink-soft shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

/** Inline star rating (uses the site accent for filled stars). */
export function SiteStars({ rating = 5 }: { rating?: number }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span aria-label={`${full} out of 5 stars`} className="text-amber-500">
      {"★★★★★".slice(0, full)}
      <span className="text-slate-300">{"★★★★★".slice(full)}</span>
    </span>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="mt-0.5 h-4 w-4 flex-none"
      style={{ color: "var(--site-primary)" }}
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.3 6.8-6.3a1 1 0 0 1 1.9 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * A single service card: name, badge, description, price, features and a
 * buy/book CTA whose label is driven by the site's booking mode.
 */
export function ServiceCard({
  service,
  bookingMode,
  href,
  radius,
}: {
  service: Service;
  bookingMode: "checkout" | "booking" | "lead";
  href: string;
  radius: string;
}) {
  const isPopular = Boolean(service.badge);
  return (
    <div
      className="flex h-full flex-col border bg-white p-6 shadow-sm transition hover:shadow-md"
      style={{
        borderRadius: radius,
        borderColor: isPopular ? "var(--site-primary)" : "#e2e8f0",
        boxShadow: isPopular ? "0 8px 30px -12px var(--site-primary)" : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-ink">{service.name}</h3>
        {service.badge ? (
          <span
            className="inline-flex flex-none items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: "var(--site-primary)" }}
          >
            {service.badge}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-ink-soft">{service.description}</p>

      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold text-ink">{formatPrice(service.price)}</span>
        {service.priceUnit && service.priceUnit !== "flat" ? (
          <span className="text-sm font-medium text-ink-faint">{service.priceUnit}</span>
        ) : null}
      </div>

      {service.features.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {service.features.map((feature) => (
            <li key={feature} className="flex gap-2 text-sm text-ink-soft">
              <CheckIcon />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <a
        href={href}
        className="mt-6 inline-flex w-full items-center justify-center px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        style={{ backgroundColor: "var(--site-primary)", borderRadius: radius }}
      >
        {ctaLabel(bookingMode)}
      </a>
    </div>
  );
}

/** A customer review card. */
export function ReviewCard({ review, radius }: { review: Review; radius: string }) {
  return (
    <figure
      className="flex h-full flex-col border border-slate-200 bg-white p-6 shadow-sm"
      style={{ borderRadius: radius }}
    >
      <SiteStars rating={review.rating} />
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
        “{review.text}”
      </blockquote>
      <figcaption className="mt-4 text-sm font-semibold text-ink">
        {review.author}
        {review.city ? <span className="font-normal text-ink-faint"> · {review.city}</span> : null}
      </figcaption>
    </figure>
  );
}
