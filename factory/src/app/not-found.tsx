import Link from "next/link";
import { BRAND } from "@/config/brand";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-50 to-white px-5 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink">Page not found</h1>
      <p className="mt-4 max-w-md text-ink-soft">
        That page doesn&apos;t exist. Let&apos;s get you back to building your site with {BRAND.name}.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-ghost">
          Go home
        </Link>
        <Link href="/start" className="btn-primary">
          Build my site →
        </Link>
      </div>
    </main>
  );
}
