import Link from "next/link";
import { BRAND } from "@/config/brand";
import { VERTICALS } from "@/lib/verticals";

const PRODUCT_LINKS: { href: string; label: string }[] = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/start", label: "Build my site" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-x py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-black text-white">
                L
              </span>
              {BRAND.name}
            </Link>
            <p className="mt-4 text-sm text-ink-soft">{BRAND.tagline}</p>
            <p className="mt-4 text-sm text-ink-faint">
              Serving {BRAND.region}.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={BRAND.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-ink-soft transition-colors hover:text-brand-600"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
                </svg>
              </a>
              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-ink-soft transition-colors hover:text-brand-600"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Product</h3>
            <ul className="mt-4 space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-soft transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">For your business</h3>
            <ul className="mt-4 space-y-3">
              {VERTICALS.slice(0, 6).map((v) => (
                <li key={v.slug}>
                  <Link
                    href={`/websites-for/${v.slug}`}
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {v.emoji} {v.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li>
                <a href={`mailto:${BRAND.email}`} className="transition-colors hover:text-ink">
                  {BRAND.email}
                </a>
              </li>
              <li>
                <a href={`tel:${BRAND.phone.replace(/[^\d+]/g, "")}`} className="transition-colors hover:text-ink">
                  {BRAND.phone}
                </a>
              </li>
              <li className="text-ink-faint">{BRAND.region}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-xs text-ink-faint">
            &copy; {BRAND.foundedYear}
            {year > BRAND.foundedYear ? `–${year}` : ""} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-xs text-ink-faint">Built &amp; run for local businesses in {BRAND.region}.</p>
        </div>
      </div>
    </footer>
  );
}
