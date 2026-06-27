import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { billingEnabled, getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<NextResponse> {
  // Demo mode — nothing to verify or process.
  if (!billingEnabled) {
    return NextResponse.json({ demo: true });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ demo: true });
  }

  const rawBody = await req.text();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  if (webhookSecret) {
    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header." },
        { status: 400 },
      );
    }
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Signature verification failed.";
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${message}` },
        { status: 400 },
      );
    }
  } else {
    // No signing secret configured — parse without verification (dev only).
    try {
      event = JSON.parse(rawBody) as Stripe.Event;
    } catch {
      return NextResponse.json(
        { error: "Invalid webhook payload." },
        { status: 400 },
      );
    }
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const slug = session.metadata?.slug || "(unknown)";
      const plan = session.metadata?.plan || "(unknown)";
      // TODO: activate the tenant site for this slug.
      console.log(
        `[stripe] checkout.session.completed — activate tenant slug=\"${slug}\" plan=\"${plan}\" subscription=${String(
          session.subscription,
        )}`,
      );
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const slug = subscription.metadata?.slug || "(unknown)";
      // TODO: deactivate the tenant site for this slug.
      console.log(
        `[stripe] customer.subscription.deleted — deactivate tenant slug=\"${slug}\" status=\"${subscription.status}\"`,
      );
      break;
    }
    default: {
      console.log(`[stripe] unhandled event type: ${event.type}`);
    }
  }

  return NextResponse.json({ received: true });
}
