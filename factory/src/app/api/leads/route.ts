/**
 * POST /api/leads
 *
 * The missed-call-text-back + AI-triage endpoint. A generated tenant site posts
 * a new lead here; we capture it, then immediately draft the qualified instant
 * reply (Anthropic when ANTHROPIC_API_KEY is set, templated fallback otherwise).
 *
 * Body: { name?, phone, zip?, message?, slug, source? }
 * Returns: { ok, leadId, autoReply }
 */

import { captureLead, draftTriageReply, type Lead } from "@/lib/automation";
import { getSite } from "@/data/sites";

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body." }, 400);
  }

  const lead = coerceLead(body);
  if (!lead) {
    return json(
      { ok: false, error: "Missing required fields: phone and slug." },
      400,
    );
  }

  const { ok, leadId } = await captureLead(lead);

  // Pull the tenant's config so triage can personalize (cities, services,
  // qualifying questions, booking link). getSite may be undefined for unknown
  // slugs — draftTriageReply handles that gracefully.
  const config = getSite(lead.slug);
  const autoReply = await draftTriageReply(lead, config);

  return json({ ok, leadId, autoReply });
}

function coerceLead(body: unknown): Lead | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const slug = typeof b.slug === "string" ? b.slug.trim() : "";
  if (!phone || !slug) return null;

  const lead: Lead = { phone, slug };
  if (typeof b.name === "string" && b.name.trim()) lead.name = b.name.trim();
  if (typeof b.zip === "string" && b.zip.trim()) lead.zip = b.zip.trim();
  if (typeof b.message === "string" && b.message.trim()) {
    lead.message = b.message.trim();
  }
  if (typeof b.source === "string" && b.source.trim()) {
    lead.source = b.source.trim();
  }
  return lead;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
