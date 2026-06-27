"use client";

import { useMemo, useState } from "react";
import type {
  SiteConfig,
  Service,
  Booking,
  Theme,
} from "@/lib/site-config";
import { safeParseSiteConfig } from "@/lib/site-config";
import { VERTICALS, verticalBySlug } from "@/lib/verticals";
import { TREASURE_VALLEY } from "@/lib/geo";
import { PLANS } from "@/lib/plans";
import { presetFor } from "@/lib/presets";
import { TenantSite } from "@/components/template/TenantSite";

/* ------------------------------------------------------------------ */
/* Draft state model                                                   */
/* ------------------------------------------------------------------ */

/**
 * The wizard mutates a partial draft. Everything is optional while the
 * owner is filling it in; we coerce to a full SiteConfig (with defaults)
 * before validating + submitting.
 */
type Draft = {
  slug?: string;
  vertical: string;
  businessName: string;
  tagline: string;
  about: string;
  phone: string;
  email: string;
  citiesServed: string[];
  primaryCity: string;
  theme: Theme;
  services: Service[];
  trustBadges: string[];
  booking: Booking;
  plan: SiteConfig["plan"];
};

const DEFAULT_THEME: Theme = { primary: "#1f5af0", accent: "#0b1120", shape: "rounded" };
const DEFAULT_BOOKING: Booking = { mode: "booking", depositPercent: 25, financing: false };

const TRUST_BADGE_OPTIONS = [
  "Licensed",
  "Bonded",
  "Insured",
  "30-day guarantee",
  "Locally owned",
  "Background-checked",
  "Free estimates",
  "Satisfaction guaranteed",
] as const;

const PRICE_UNITS = [
  "flat",
  "starting at",
  "per visit",
  "per room",
  "per hour",
  "per sq ft",
  "per month",
] as const;

function emptyDraft(): Draft {
  return {
    vertical: "",
    businessName: "",
    tagline: "",
    about: "",
    phone: "",
    email: "",
    citiesServed: [],
    primaryCity: TREASURE_VALLEY[0]?.name ?? "",
    theme: { ...DEFAULT_THEME },
    services: [],
    trustBadges: [],
    booking: { ...DEFAULT_BOOKING },
    plan: "growth",
  };
}

/** Generate a URL-safe slug from the business name. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['".]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Coerce the (possibly incomplete) draft into a SiteConfig-shaped object. */
function draftToConfig(d: Draft): SiteConfig {
  const slug = d.slug?.trim() || slugify(d.businessName) || "your-business";
  return {
    slug,
    vertical: d.vertical || "handyman",
    businessName: d.businessName || "Your Business",
    tagline: d.tagline || "Local pros you can count on.",
    about:
      d.about ||
      `${d.businessName || "We"} proudly serve ${d.primaryCity || "the Treasure Valley"} and the surrounding area.`,
    phone: d.phone || "(208) 555-0000",
    email: d.email.trim() ? d.email.trim() : undefined,
    citiesServed: d.citiesServed.length ? d.citiesServed : [d.primaryCity].filter(Boolean),
    primaryCity: d.primaryCity || TREASURE_VALLEY[0]?.name || "Boise",
    theme: d.theme,
    services:
      d.services.length > 0
        ? d.services
        : [
            {
              name: "Standard service",
              description: "Our core offering, done right.",
              price: 199,
              priceUnit: "starting at",
              features: [],
            },
          ],
    reviews: [],
    booking: d.booking,
    automation: {
      missedCallTextBack: true,
      aiTriage: true,
      reviewRequest: true,
      qualifyingQuestions: [
        "What's your ZIP code?",
        "What service do you need?",
        "When works best for you?",
      ],
    },
    trustBadges: d.trustBadges,
    plan: d.plan,
  };
}

/* ------------------------------------------------------------------ */
/* Step config                                                         */
/* ------------------------------------------------------------------ */

const STEPS = [
  "Business type",
  "Basics",
  "Services & prices",
  "Trust & booking",
  "Plan & review",
] as const;

type SubmitState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved"; slug: string }
  | { status: "error"; message: string };

/* ------------------------------------------------------------------ */
/* Wizard                                                              */
/* ------------------------------------------------------------------ */

export function Wizard() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [showPreview, setShowPreview] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>({ status: "idle" });
  const [checkoutPending, setCheckoutPending] = useState(false);

  const previewConfig = useMemo(() => draftToConfig(draft), [draft]);
  const parsed = useMemo(() => safeParseSiteConfig(previewConfig), [previewConfig]);

  function patch(p: Partial<Draft>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  /* ---- per-step validation (gates the Next button) ---- */
  function stepError(): string | null {
    switch (step) {
      case 0:
        return draft.vertical ? null : "Pick a business type to continue.";
      case 1: {
        if (!draft.businessName.trim()) return "Business name is required.";
        if (!draft.phone.trim()) return "A phone number is required.";
        if (draft.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(draft.email.trim()))
          return "That email doesn't look right.";
        if (!draft.primaryCity) return "Pick your primary city.";
        if (draft.citiesServed.length === 0) return "Select at least one city you serve.";
        return null;
      }
      case 2:
        if (draft.services.length === 0) return "Add at least one service.";
        if (draft.services.some((s) => !s.name.trim()))
          return "Every service needs a name.";
        return null;
      case 3:
        return null;
      case 4:
        if (!parsed.success) return "Some details are still missing — go back and complete them.";
        return null;
      default:
        return null;
    }
  }

  const error = stepError();
  const isLast = step === STEPS.length - 1;

  function next() {
    if (stepError()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  /* ---- vertical selection: prefill from preset ---- */
  function pickVertical(slug: string) {
    const v = verticalBySlug(slug);
    const preset = presetFor(slug) as Partial<SiteConfig> | undefined;
    setDraft((d) => ({
      ...d,
      vertical: slug,
      // Only seed fields the owner hasn't already typed.
      tagline: d.tagline || preset?.tagline || "",
      about: d.about || preset?.about || "",
      theme: preset?.theme ? { ...DEFAULT_THEME, ...preset.theme } : d.theme,
      services:
        d.services.length > 0
          ? d.services
          : (preset?.services ?? []).map((s) => ({ ...s })),
      trustBadges: d.trustBadges.length > 0 ? d.trustBadges : preset?.trustBadges ?? [],
      booking: {
        ...d.booking,
        mode: preset?.booking?.mode ?? v?.bookingMode ?? d.booking.mode,
        ...(preset?.booking ?? {}),
      },
    }));
  }

  /* ---- submit ---- */
  async function finish() {
    if (!parsed.success) {
      setSubmit({ status: "error", message: "Please complete all required fields." });
      return;
    }
    setSubmit({ status: "saving" });
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || `Save failed (${res.status})`);
      }
      const body = (await res.json().catch(() => ({}))) as { slug?: string };
      setSubmit({ status: "saved", slug: body.slug || parsed.data.slug });
    } catch (e) {
      setSubmit({
        status: "error",
        message: e instanceof Error ? e.message : "Something went wrong saving your site.",
      });
    }
  }

  async function startSubscription() {
    setCheckoutPending(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: draft.plan, slug: previewConfig.slug }),
      });
      const body = (await res.json().catch(() => null)) as { url?: string } | null;
      if (body?.url) {
        window.location.href = body.url;
        return;
      }
      throw new Error("Could not start checkout.");
    } catch {
      setCheckoutPending(false);
    }
  }

  /* ---- success screen ---- */
  if (submit.status === "saved") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="card text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
            ✅
          </div>
          <h2 className="text-2xl font-extrabold text-ink">Your site is live!</h2>
          <p className="mt-3 text-ink-soft">
            We generated <strong>{draft.businessName}</strong> from your answers. Preview it,
            then start your subscription to publish it on your own domain and turn on automation.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a className="btn-ghost" href={`/sites/${submit.slug}`} target="_blank" rel="noreferrer">
              View your site →
            </a>
            <button
              type="button"
              className="btn-primary"
              onClick={startSubscription}
              disabled={checkoutPending}
            >
              {checkoutPending ? "Redirecting…" : "Start subscription"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Progress step={step} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(0,420px)]">
        {/* form column */}
        <div className="card">
          {step === 0 && <StepVertical draft={draft} onPick={pickVertical} />}
          {step === 1 && <StepBasics draft={draft} patch={patch} />}
          {step === 2 && <StepServices draft={draft} patch={patch} />}
          {step === 3 && <StepTrustBooking draft={draft} patch={patch} />}
          {step === 4 && <StepReview draft={draft} patch={patch} config={previewConfig} />}

          {error && (
            <p className="mt-5 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}
          {submit.status === "error" && (
            <p className="mt-5 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {submit.message}
            </p>
          )}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              className="btn-ghost"
              onClick={back}
              disabled={step === 0}
              style={step === 0 ? { visibility: "hidden" } : undefined}
            >
              ← Back
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-sm font-semibold text-brand-700 underline-offset-2 hover:underline"
                onClick={() => setShowPreview((v) => !v)}
              >
                {showPreview ? "Hide preview" : "Preview"}
              </button>

              {isLast ? (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={finish}
                  disabled={!parsed.success || submit.status === "saving"}
                >
                  {submit.status === "saving" ? "Generating…" : "Generate my site"}
                </button>
              ) : (
                <button type="button" className="btn-primary" onClick={next} disabled={!!error}>
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* summary / live preview column */}
        <aside className="space-y-4">
          {showPreview ? (
            <LivePreview config={previewConfig} valid={parsed.success} />
          ) : (
            <Summary draft={draft} config={previewConfig} valid={parsed.success} />
          )}
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Progress indicator                                                  */
/* ------------------------------------------------------------------ */

function Progress({ step }: { step: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 text-sm">
      {STEPS.map((label, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                active
                  ? "bg-brand-600 text-white"
                  : done
                    ? "bg-brand-100 text-brand-700"
                    : "bg-slate-100 text-ink-faint",
              ].join(" ")}
            >
              {done ? "✓" : i + 1}
            </span>
            <span
              className={[
                "hidden font-semibold sm:inline",
                active ? "text-ink" : "text-ink-faint",
              ].join(" ")}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-4 bg-slate-200 sm:w-8" />}
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Step 1 — Business type                                              */
/* ------------------------------------------------------------------ */

function StepVertical({ draft, onPick }: { draft: Draft; onPick: (slug: string) => void }) {
  return (
    <div>
      <StepHeading
        title="What kind of business is this?"
        sub="We'll prefill your services, copy, and booking flow from a proven template for your trade."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {VERTICALS.map((v) => {
          const selected = draft.vertical === v.slug;
          return (
            <button
              key={v.slug}
              type="button"
              onClick={() => onPick(v.slug)}
              className={[
                "rounded-xl border p-4 text-left transition",
                selected
                  ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-200"
                  : "border-slate-200 hover:border-brand-300 hover:bg-slate-50",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden>
                  {v.emoji}
                </span>
                <span className="font-bold text-ink">{v.name}</span>
                {selected && <span className="ml-auto text-brand-600">✓</span>}
              </div>
              <p className="mt-2 text-sm text-ink-soft">{v.pain}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 2 — Basics                                                     */
/* ------------------------------------------------------------------ */

function StepBasics({ draft, patch }: { draft: Draft; patch: (p: Partial<Draft>) => void }) {
  function toggleCity(name: string) {
    const has = draft.citiesServed.includes(name);
    patch({
      citiesServed: has
        ? draft.citiesServed.filter((c) => c !== name)
        : [...draft.citiesServed, name],
    });
  }

  return (
    <div>
      <StepHeading
        title="Business basics"
        sub="These drive your headline, contact info, and the local landing pages we generate."
      />
      <div className="grid gap-4">
        <Field label="Business name" required>
          <input
            className={inputCls}
            value={draft.businessName}
            onChange={(e) => patch({ businessName: e.target.value })}
            placeholder="e.g. Valley Pro Cleaning"
          />
          {draft.businessName.trim() && (
            <p className="mt-1 text-xs text-ink-faint">
              Your site: <span className="font-mono">/sites/{slugify(draft.businessName)}</span>
            </p>
          )}
        </Field>

        <Field label="Tagline">
          <input
            className={inputCls}
            value={draft.tagline}
            onChange={(e) => patch({ tagline: e.target.value })}
            placeholder="One line that sells the outcome."
          />
        </Field>

        <Field label="About (short)">
          <textarea
            className={`${inputCls} min-h-[90px]`}
            value={draft.about}
            onChange={(e) => patch({ about: e.target.value })}
            placeholder="A sentence or two about who you are and who you serve."
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" required>
            <input
              className={inputCls}
              value={draft.phone}
              onChange={(e) => patch({ phone: e.target.value })}
              placeholder="(208) 555-0123"
              inputMode="tel"
            />
          </Field>
          <Field label="Email">
            <input
              className={inputCls}
              value={draft.email}
              onChange={(e) => patch({ email: e.target.value })}
              placeholder="you@business.com"
              inputMode="email"
            />
          </Field>
        </div>

        <Field label="Primary city" required>
          <select
            className={inputCls}
            value={draft.primaryCity}
            onChange={(e) => {
              const city = e.target.value;
              patch({
                primaryCity: city,
                citiesServed: draft.citiesServed.includes(city)
                  ? draft.citiesServed
                  : [...draft.citiesServed, city],
              });
            }}
          >
            {TREASURE_VALLEY.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Cities you serve" required>
          <div className="flex flex-wrap gap-2">
            {TREASURE_VALLEY.map((c) => {
              const on = draft.citiesServed.includes(c.name);
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => toggleCity(c.name)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-sm font-semibold transition",
                    on
                      ? "border-brand-500 bg-brand-600 text-white"
                      : "border-slate-200 text-ink-soft hover:border-brand-300",
                  ].join(" ")}
                >
                  {on ? "✓ " : ""}
                  {c.name}
                </button>
              );
            })}
          </div>
        </Field>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 3 — Services & prices                                          */
/* ------------------------------------------------------------------ */

function StepServices({ draft, patch }: { draft: Draft; patch: (p: Partial<Draft>) => void }) {
  function update(i: number, p: Partial<Service>) {
    patch({ services: draft.services.map((s, idx) => (idx === i ? { ...s, ...p } : s)) });
  }
  function remove(i: number) {
    patch({ services: draft.services.filter((_, idx) => idx !== i) });
  }
  function add() {
    patch({
      services: [
        ...draft.services,
        { name: "", description: "", price: 0, priceUnit: "starting at", features: [] },
      ],
    });
  }

  return (
    <div>
      <StepHeading
        title="Services & prices"
        sub="Posted prices convert. Each one becomes a card with a buy/booking button on your site."
      />
      <div className="space-y-4">
        {draft.services.length === 0 && (
          <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-ink-faint">
            No services yet. Add your first one below.
          </p>
        )}

        {draft.services.map((s, i) => (
          <div key={i} className="rounded-xl border border-slate-200 p-4">
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <input
                  className={inputCls}
                  value={s.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                  placeholder="Service name"
                />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  aria-label="Remove service"
                >
                  Remove
                </button>
              </div>
              <textarea
                className={`${inputCls} min-h-[60px]`}
                value={s.description}
                onChange={(e) => update(i, { description: e.target.value })}
                placeholder="One line describing what's included."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink-soft">$</span>
                  <input
                    className={inputCls}
                    type="number"
                    min={0}
                    value={Number.isFinite(s.price) ? s.price : 0}
                    onChange={(e) =>
                      update(i, { price: Math.max(0, Math.round(Number(e.target.value) || 0)) })
                    }
                  />
                </label>
                <select
                  className={inputCls}
                  value={s.priceUnit}
                  onChange={(e) => update(i, { priceUnit: e.target.value })}
                >
                  {PRICE_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          className="w-full rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-semibold text-brand-700 hover:border-brand-300 hover:bg-brand-50/40"
        >
          + Add a service
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 4 — Trust & booking                                            */
/* ------------------------------------------------------------------ */

const BOOKING_MODES: { value: Booking["mode"]; title: string; sub: string }[] = [
  { value: "checkout", title: "Buy online now", sub: "Customer pays in full at checkout." },
  { value: "booking", title: "Book a slot + deposit", sub: "Reserve a time, take a deposit." },
  { value: "lead", title: "Capture lead + auto-reply", sub: "Collect details, follow up fast." },
];

function StepTrustBooking({
  draft,
  patch,
}: {
  draft: Draft;
  patch: (p: Partial<Draft>) => void;
}) {
  function toggleBadge(b: string) {
    const has = draft.trustBadges.includes(b);
    patch({
      trustBadges: has ? draft.trustBadges.filter((x) => x !== b) : [...draft.trustBadges, b],
    });
  }
  function patchBooking(p: Partial<Booking>) {
    patch({ booking: { ...draft.booking, ...p } });
  }

  return (
    <div>
      <StepHeading
        title="Trust & booking"
        sub="Tell buyers why you're safe to hire and how they pay or book."
      />

      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold text-ink">Trust badges</p>
        <div className="flex flex-wrap gap-2">
          {TRUST_BADGE_OPTIONS.map((b) => {
            const on = draft.trustBadges.includes(b);
            return (
              <button
                key={b}
                type="button"
                onClick={() => toggleBadge(b)}
                className={[
                  "rounded-full border px-3 py-1.5 text-sm font-semibold transition",
                  on
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 text-ink-soft hover:border-emerald-300",
                ].join(" ")}
              >
                {on ? "✓ " : ""}
                {b}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold text-ink">How do customers transact?</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {BOOKING_MODES.map((m) => {
            const on = draft.booking.mode === m.value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => patchBooking({ mode: m.value })}
                className={[
                  "rounded-xl border p-3 text-left transition",
                  on
                    ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-200"
                    : "border-slate-200 hover:border-brand-300",
                ].join(" ")}
              >
                <span className="block text-sm font-bold text-ink">{m.title}</span>
                <span className="mt-1 block text-xs text-ink-soft">{m.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={`Deposit required: ${draft.booking.depositPercent}%`}>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={draft.booking.depositPercent}
            onChange={(e) => patchBooking({ depositPercent: Number(e.target.value) })}
            className="w-full accent-brand-600"
          />
        </Field>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3">
          <input
            type="checkbox"
            checked={draft.booking.financing}
            onChange={(e) => patchBooking({ financing: e.target.checked })}
            className="mt-0.5 h-5 w-5 accent-brand-600"
          />
          <span>
            <span className="block text-sm font-bold text-ink">Offer financing</span>
            <span className="block text-xs text-ink-soft">
              Show a &ldquo;pay over time&rdquo; option on pricing.
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step 5 — Plan & review                                              */
/* ------------------------------------------------------------------ */

function StepReview({
  draft,
  patch,
  config,
}: {
  draft: Draft;
  patch: (p: Partial<Draft>) => void;
  config: SiteConfig;
}) {
  return (
    <div>
      <StepHeading
        title="Pick a plan & review"
        sub="Choose the tier that fits, then generate your site. You can change plans anytime."
      />

      <div className="mb-7 grid gap-3 sm:grid-cols-3">
        {PLANS.map((p) => {
          const on = draft.plan === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => patch({ plan: p.id })}
              className={[
                "relative rounded-xl border p-4 text-left transition",
                on
                  ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-200"
                  : "border-slate-200 hover:border-brand-300",
              ].join(" ")}
            >
              {p.highlighted && (
                <span className="absolute -top-2 right-3 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Popular
                </span>
              )}
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-ink">{p.name}</span>
                {on && <span className="text-brand-600">✓</span>}
              </div>
              <p className="mt-1 text-2xl font-extrabold text-ink">
                ${p.priceMonthly}
                <span className="text-sm font-medium text-ink-faint">/mo</span>
              </p>
              <p className="mt-1 text-xs text-ink-soft">{p.tagline}</p>
              <ul className="mt-3 space-y-1">
                {p.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex gap-1.5 text-xs text-ink-soft">
                    <span className="text-brand-600">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <p className="mb-3 text-sm font-bold text-ink">Review</p>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <Row label="Business" value={config.businessName} />
          <Row label="Type" value={verticalBySlug(config.vertical)?.name ?? config.vertical} />
          <Row label="Phone" value={config.phone} />
          <Row label="Email" value={config.email ?? "—"} />
          <Row label="Primary city" value={config.primaryCity} />
          <Row label="Cities served" value={config.citiesServed.join(", ")} />
          <Row label="Services" value={`${config.services.length} listed`} />
          <Row label="Booking" value={config.booking.mode} />
          <Row label="Deposit" value={`${config.booking.depositPercent}%`} />
          <Row label="Financing" value={config.booking.financing ? "Yes" : "No"} />
          <Row label="Trust badges" value={config.trustBadges.join(", ") || "—"} />
          <Row label="Plan" value={config.plan} />
        </dl>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Live preview + summary sidebar                                      */
/* ------------------------------------------------------------------ */

function LivePreview({ config, valid }: { config: SiteConfig; valid: boolean }) {
  return (
    <div className="card p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">Live preview</p>
        <span
          className={[
            "rounded-full px-2 py-0.5 text-[10px] font-bold",
            valid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
          ].join(" ")}
        >
          {valid ? "Ready" : "Draft"}
        </span>
      </div>
      <div className="max-h-[640px] overflow-y-auto rounded-xl border border-slate-200 bg-white">
        <div className="origin-top scale-[0.62] [width:161%]">
          <TenantSite config={config} />
        </div>
      </div>
    </div>
  );
}

function Summary({
  draft,
  config,
  valid,
}: {
  draft: Draft;
  config: SiteConfig;
  valid: boolean;
}) {
  return (
    <div className="card sticky top-6">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">Your site so far</p>
      <p className="mt-2 text-lg font-extrabold text-ink">
        {draft.businessName || "Untitled business"}
      </p>
      {draft.tagline && <p className="text-sm text-ink-soft">{draft.tagline}</p>}

      <dl className="mt-4 space-y-2 text-sm">
        {draft.vertical && (
          <Row label="Type" value={verticalBySlug(draft.vertical)?.name ?? draft.vertical} />
        )}
        {draft.primaryCity && <Row label="Primary city" value={draft.primaryCity} />}
        {draft.services.length > 0 && (
          <Row label="Services" value={`${draft.services.length} listed`} />
        )}
        <Row label="Booking" value={config.booking.mode} />
      </dl>

      <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-ink-faint">
        {valid
          ? "Everything checks out — tap Preview to see the full site."
          : "Keep going — fill in the required fields to finish."}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

function StepHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-extrabold text-ink">{title}</h2>
      <p className="mt-1 text-sm text-ink-soft">{sub}</p>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}
