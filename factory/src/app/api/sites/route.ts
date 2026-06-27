import { NextResponse } from "next/server";
import { safeParseSiteConfig } from "@/lib/site-config";
import { addSite, getAllSites } from "@/data/sites";

/**
 * Create (or update) a tenant site from the onboarding wizard.
 * Validates the posted SiteConfig, persists it, and returns the slug so the
 * wizard can link to the live site and start a subscription.
 *
 * NOTE: persistence here is the in-process store (see src/data/sites.ts).
 * Swap addSite() for a Postgres INSERT to make sites durable across deploys.
 */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = safeParseSiteConfig(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid site configuration.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const site = addSite(parsed.data);
  return NextResponse.json({ ok: true, slug: site.slug }, { status: 201 });
}

/** List existing sites (handy for an owner dashboard later). */
export function GET() {
  return NextResponse.json({ sites: getAllSites().map((s) => ({ slug: s.slug, businessName: s.businessName })) });
}
