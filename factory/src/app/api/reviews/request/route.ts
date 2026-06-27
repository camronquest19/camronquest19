/**
 * POST /api/reviews/request
 *
 * The auto-review-request step of the playbook loop: this is what gets texted
 * to a customer +1 day after a completed job. It returns the ready-to-send
 * message string; the SMS provider (or the caller) does the actual sending.
 *
 * Body: { slug, customerName, reviewLink }
 * Returns: { message }
 */

import { reviewRequestMessage } from "@/lib/automation";
import { getSite } from "@/data/sites";

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  if (typeof body !== "object" || body === null) {
    return json({ error: "Expected a JSON object." }, 400);
  }
  const b = body as Record<string, unknown>;

  const slug = typeof b.slug === "string" ? b.slug.trim() : "";
  const reviewLink =
    typeof b.reviewLink === "string" ? b.reviewLink.trim() : "";
  const customerName =
    typeof b.customerName === "string" ? b.customerName.trim() : "";

  if (!slug || !reviewLink) {
    return json(
      { error: "Missing required fields: slug and reviewLink." },
      400,
    );
  }

  // Personalize with the tenant's business name when we can resolve the slug.
  const config = getSite(slug);
  const businessName = config?.businessName ?? "us";

  let message = reviewRequestMessage(businessName, reviewLink);
  if (customerName) {
    // Lead the message with the customer's name for a warmer, higher-converting ask.
    message = message.replace(/^Hi!/, `Hi ${customerName}!`);
  }

  return json({ message });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
