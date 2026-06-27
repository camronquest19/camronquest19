import { NextResponse } from "next/server";
import { billingEnabled, getStripe } from "@/lib/stripe";
import { planById, type PlanId } from "@/lib/plans";
import { siteUrl } from "@/config/brand";

export const runtime = "nodejs";

interface CheckoutBody {
  plan?: PlanId;
  slug?: string;
}

const VALID_PLANS: PlanId[] = ["starter", "growth", "pro"];

function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && (VALID_PLANS as string[]).includes(value);
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const { plan, slug } = body;

  if (!isPlanId(plan)) {
    return NextResponse.json(
      { error: "Unknown or missing plan. Expected one of: starter, growth, pro." },
      { status: 400 },
    );
  }

  const selected = planById(plan);
  if (!selected) {
    return NextResponse.json({ error: "Plan not found." }, { status: 400 });
  }

  // Safe demo mode — no Stripe keys configured.
  if (!billingEnabled) {
    return NextResponse.json({
      demo: true,
      message: "Billing not configured — running in demo mode",
      plan,
    });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({
      demo: true,
      message: "Billing not configured — running in demo mode",
      plan,
    });
  }

  const priceId = process.env[selected.stripePriceEnv];
  if (!priceId) {
    return NextResponse.json(
      {
        error: `Missing Stripe price id (${selected.stripePriceEnv}) for plan “${plan}”.`,
      },
      { status: 500 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/start?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/start?checkout=cancelled`,
      allow_promotion_codes: true,
      metadata: { slug: slug ?? "", plan },
      subscription_data: {
        metadata: { slug: slug ?? "", plan },
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create checkout session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
