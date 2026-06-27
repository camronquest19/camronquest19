import { pageMetadata } from "@/lib/seo";
import { BRAND } from "@/config/brand";
import { Wizard } from "@/components/onboarding/Wizard";
import type { PlanId } from "@/lib/plans";

export const metadata = pageMetadata({
  title: `Launch your site — ${BRAND.name}`,
  description:
    "Build a complete, SEO-optimized local-business website in minutes. Pick your trade, set your services and prices, and go live with a real buy button.",
  path: "/start",
});

const VALID_PLANS: PlanId[] = ["starter", "growth", "pro"];

function planFromParam(value: string | string[] | undefined): PlanId | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw && (VALID_PLANS as string[]).includes(raw) ? (raw as PlanId) : undefined;
}

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[] }>;
}) {
  const params = await searchParams;
  const initialPlan = planFromParam(params.plan);

  return (
    <main className="bg-slate-50/60 pb-24">
      <div className="container-x pt-12 sm:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-3">Self-serve onboarding</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Build your local-business website
          </h1>
          <p className="mt-4 text-lg text-ink-soft">
            Five quick steps. Pick your trade, confirm your services and prices,
            and we&apos;ll generate a full site with a buy button, reviews, and
            automated follow-up — ready to publish today.
          </p>
        </div>
      </div>

      <div className="container-x mt-10">
        <Wizard initialPlan={initialPlan} />
      </div>
    </main>
  );
}
