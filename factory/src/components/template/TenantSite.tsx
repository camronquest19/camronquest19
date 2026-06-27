import type { CSSProperties } from "react";
import type { SiteConfig } from "@/lib/site-config";
import {
  ServiceCard,
  ReviewCard,
  Pill,
  ctaLabel,
} from "@/components/template/tenant-sections";

/**
 * The single entry point of the template engine. Given a SiteConfig it renders
 * a complete, SEO/GEO-optimized local-business site. No business detail is ever
 * hard-coded — everything is read from `config`. The owner's brand color
 * (theme.primary) is injected as the CSS var `--site-primary` and used as the
 * accent throughout.
 */
export function TenantSite({ config }: { config: SiteConfig }) {
  const {
    businessName,
    tagline,
    about,
    phone,
    email,
    citiesServed,
    primaryCity,
    theme,
    services,
    reviews,
    booking,
    trustBadges,
  } = config;

  const radius = theme.shape === "sharp" ? "0.25rem" : "1rem";
  const telHref = `tel:${phone.replace(/[^0-9+]/g, "")}`;
  const primaryCtaLabel = ctaLabel(booking.mode);
  const bookHref = booking.externalUrl ?? "#services";

  const rootStyle = {
    "--site-primary": theme.primary,
  } as CSSProperties;

  const bookExplainer: Record<typeof booking.mode, { title: string; body: string }> = {
    checkout: {
      title: "Buy online in 60 seconds",
      body: "Pick what you want, check out securely, and we handle the rest. Posted prices — no waiting on a quote.",
    },
    booking: {
      title: "Book your slot online",
      body: `Choose a time that works for you and reserve it instantly${
        booking.depositPercent > 0
          ? ` with a small ${booking.depositPercent}% deposit`
          : " — no deposit needed"
      }. You'll get an instant confirmation.`,
    },
    lead: {
      title: "Get a fast, free quote",
      body: "Tell us what you need and we'll text you back right away with a clear, upfront price. No phone tag.",
    },
  };
  const explainer = bookExplainer[booking.mode];

  return (
    <div style={rootStyle} className="min-h-screen bg-white font-sans text-ink">
      {/* Sticky mini-header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="container-x flex items-center justify-between gap-3 py-3">
          <span className="truncate text-base font-extrabold tracking-tight text-ink">
            {businessName}
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={telHref}
              className="hidden text-sm font-semibold text-ink-soft hover:text-ink sm:inline"
            >
              {phone}
            </a>
            <a
              href={bookHref}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: "var(--site-primary)", borderRadius: radius }}
            >
              {primaryCtaLabel}
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, color-mix(in srgb, var(--site-primary) 10%, #ffffff) 0%, #ffffff 60%)",
        }}
      >
        <div className="container-x grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--site-primary)" }}
            >
              {primaryCity} &amp; the Treasure Valley
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
              {tagline}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-soft">{about}</p>

            {trustBadges.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {trustBadges.map((badge) => (
                  <Pill key={badge}>
                    <span style={{ color: "var(--site-primary)" }}>✓</span> {badge}
                  </Pill>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={bookHref}
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: "var(--site-primary)", borderRadius: radius }}
              >
                {primaryCtaLabel}
              </a>
              <a
                href={telHref}
                className="inline-flex items-center justify-center border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-ink shadow-sm transition hover:bg-slate-50"
                style={{ borderRadius: radius }}
              >
                Call {phone}
              </a>
            </div>
          </div>

          <div className="hidden lg:block">
            <div
              className="relative aspect-[4/3] w-full overflow-hidden border border-slate-200 shadow-sm"
              style={{
                borderRadius: radius,
                background:
                  "radial-gradient(120% 120% at 0% 0%, color-mix(in srgb, var(--site-primary) 22%, #ffffff) 0%, #ffffff 70%)",
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <span
                  className="text-sm font-bold uppercase tracking-[0.2em]"
                  style={{ color: "var(--site-primary)" }}
                >
                  Serving {citiesServed.length} cities
                </span>
                <span className="text-2xl font-extrabold text-ink">{businessName}</span>
                <span className="text-sm text-ink-faint">{config.vertical}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-16 sm:py-24">
        <div className="container-x">
          <div className="max-w-2xl">
            <p
              className="text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--site-primary)" }}
            >
              Services &amp; pricing
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Posted prices. No surprises.
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              Pick what you need and {primaryCtaLabel.toLowerCase()} in seconds.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.name}
                service={service}
                bookingMode={booking.mode}
                href={bookHref}
                radius={radius}
              />
            ))}
          </div>

          {/* BUY / BOOK explainer */}
          <div
            className="mt-10 flex flex-col items-start gap-4 border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
            style={{
              borderRadius: radius,
              borderColor: "color-mix(in srgb, var(--site-primary) 35%, #e2e8f0)",
              background: "color-mix(in srgb, var(--site-primary) 7%, #ffffff)",
            }}
          >
            <div className="max-w-2xl">
              <h3 className="text-xl font-bold text-ink">{explainer.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{explainer.body}</p>
              {booking.financing ? (
                <p className="mt-2 text-sm font-semibold" style={{ color: "var(--site-primary)" }}>
                  Financing available — pay over time on approved credit.
                </p>
              ) : null}
            </div>
            <a
              href={bookHref}
              className="inline-flex flex-none items-center justify-center px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: "var(--site-primary)", borderRadius: radius }}
            >
              {primaryCtaLabel}
            </a>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      {reviews.length > 0 ? (
        <section className="bg-slate-50 py-16 sm:py-24">
          <div className="container-x">
            <div className="max-w-2xl">
              <p
                className="text-xs font-bold uppercase tracking-[0.18em]"
                style={{ color: "var(--site-primary)" }}
              >
                Reviews
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Neighbors who trust us
              </h2>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, i) => (
                <ReviewCard key={`${review.author}-${i}`} review={review} radius={radius} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ABOUT */}
      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--site-primary)" }}
            >
              About {businessName}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Local, reliable, and easy to work with
            </h2>
            <p className="mt-4 text-lg text-ink-soft">{about}</p>
          </div>
          {trustBadges.length > 0 ? (
            <div className="flex flex-wrap content-start gap-2 self-center">
              {trustBadges.map((badge) => (
                <Pill key={badge}>
                  <span style={{ color: "var(--site-primary)" }}>✓</span> {badge}
                </Pill>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* SERVICE AREA (GEO) */}
      <section
        className="py-16 sm:py-24"
        style={{ background: "color-mix(in srgb, var(--site-primary) 6%, #ffffff)" }}
      >
        <div className="container-x">
          <div className="max-w-2xl">
            <p
              className="text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--site-primary)" }}
            >
              Service area
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Proudly serving {primaryCity} &amp; nearby cities
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              {businessName} covers the entire Treasure Valley. Not sure if we reach you?{" "}
              <a href={telHref} className="font-semibold underline" style={{ color: "var(--site-primary)" }}>
                Give us a call
              </a>
              .
            </p>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {citiesServed.map((city) => (
              <li key={city}>
                <span
                  className="inline-flex items-center gap-1.5 border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm"
                  style={{ borderRadius: radius }}
                >
                  <span aria-hidden="true" style={{ color: "var(--site-primary)" }}>
                    ●
                  </span>
                  {city}, ID
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16 sm:py-24">
        <div className="container-x">
          <div
            className="flex flex-col items-start gap-6 border p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10"
            style={{
              borderRadius: radius,
              background: "var(--site-primary)",
            }}
          >
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Ready when you are
              </h2>
              <p className="mt-2 max-w-xl text-base text-white/90">
                {primaryCtaLabel} online, or call us — we respond fast.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm font-semibold text-white">
                <a href={telHref} className="hover:underline">
                  📞 {phone}
                </a>
                {email ? (
                  <a href={`mailto:${email}`} className="hover:underline">
                    ✉️ {email}
                  </a>
                ) : null}
              </div>
            </div>
            <a
              href={bookHref}
              className="inline-flex flex-none items-center justify-center bg-white px-6 py-3 text-base font-semibold shadow-sm transition hover:bg-white/90"
              style={{ color: "var(--site-primary)", borderRadius: radius }}
            >
              {primaryCtaLabel}
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="container-x flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-base font-extrabold text-ink">{businessName}</p>
            <p className="mt-1 text-sm text-ink-faint">
              Serving {citiesServed.join(", ")} · {primaryCity}, Idaho
            </p>
          </div>
          <div className="flex flex-col items-start gap-1 text-sm text-ink-soft sm:items-end">
            <a href={telHref} className="font-semibold hover:text-ink">
              {phone}
            </a>
            <p className="text-xs text-ink-faint">
              © {new Date().getFullYear()} {businessName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
