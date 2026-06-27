import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

/**
 * True when a Stripe secret key is configured. When false the app runs in a
 * safe “demo mode”: no live calls are made and checkout/webhook routes
 * short-circuit with demo responses.
 */
export const billingEnabled: boolean = Boolean(secretKey);

let cached: Stripe | null = null;

/**
 * Returns a configured Stripe client, or null when billing is not configured.
 * Callers must handle the null case (demo mode).
 */
export function getStripe(): Stripe | null {
  if (!secretKey) return null;
  if (cached) return cached;
  cached = new Stripe(secretKey, {
    apiVersion: "2024-12-18.acacia",
    typescript: true,
    appInfo: { name: "LaunchLocal" },
  });
  return cached;
}
