/**
 * AUTOMATION BACKBONE
 *
 * Implements the playbook follow-up loop for every generated tenant site:
 *
 *   lead capture  ->  instant text-back  ->  AI triage  ->  review request
 *
 * Dependency-free: the only outbound call is a raw `fetch` to the Anthropic
 * Messages API, and it is fully env-gated — when ANTHROPIC_API_KEY is absent
 * every function still returns a sensible, well-formed result so the app never
 * crashes in local dev or preview.
 */

import type { SiteConfig } from "@/lib/site-config";
import { BRAND } from "@/config/brand";

/** A raw inbound lead from a generated site's contact / missed-call form. */
export interface Lead {
  /** Caller / submitter name, if we got one. */
  name?: string;
  /** Best phone number to text back. Required — this is the channel. */
  phone: string;
  /** ZIP they typed (helps service-area triage). */
  zip?: string;
  /** Free-text message / what they need. */
  message?: string;
  /** The tenant site slug this lead belongs to. */
  slug: string;
  /** Where the lead came from: "missed-call" | "web-form" | "chat" | ... */
  source?: string;
}

export interface CaptureResult {
  ok: boolean;
  leadId: string;
}

/**
 * Persist + acknowledge a new lead.
 *
 * There is no database in the factory yet, so this logs the lead (which is what
 * a real CRM webhook would do) and mints a stable-ish id the caller can echo
 * back to the customer. Returns { ok, leadId }.
 */
export async function captureLead(lead: Lead): Promise<CaptureResult> {
  const leadId = makeLeadId(lead.slug);

  // In production this is where we'd fan out to the CRM / SMS provider.
  // For now, structured logging gives us an audit trail.
  console.log("[automation] lead captured", {
    leadId,
    slug: lead.slug,
    source: lead.source ?? "web-form",
    hasName: Boolean(lead.name),
    hasZip: Boolean(lead.zip),
    phone: maskPhone(lead.phone),
  });

  return { ok: true, leadId };
}

/**
 * Draft the instant text-back + AI-triage reply for a lead.
 *
 * If ANTHROPIC_API_KEY is set, we call the Anthropic Messages API
 * (model "claude-opus-4-8") to qualify ZIP / service / timeline and write a
 * friendly reply with a booking link. If the key is absent (or the call fails),
 * we fall back to a sensible template so the loop always produces a reply.
 */
export async function draftTriageReply(
  lead: Lead,
  config?: SiteConfig,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const businessName = config?.businessName ?? "our team";
  const bookingLink = bookingLinkFor(lead.slug, config);
  const questions =
    config?.automation.qualifyingQuestions ?? DEFAULT_QUALIFYING_QUESTIONS;

  if (!apiKey) {
    return fallbackTriageReply(lead, businessName, bookingLink, questions);
  }

  try {
    const system = buildTriageSystemPrompt(
      businessName,
      bookingLink,
      questions,
      config,
    );
    const userContent = buildTriageUserMessage(lead);

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-8",
        max_tokens: 1024,
        system,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!res.ok) {
      console.error("[automation] triage API error", res.status);
      return fallbackTriageReply(lead, businessName, bookingLink, questions);
    }

    const data: AnthropicMessageResponse = await res.json();
    const text = extractText(data);
    if (!text) {
      return fallbackTriageReply(lead, businessName, bookingLink, questions);
    }
    return text.trim();
  } catch (err) {
    console.error("[automation] triage request failed", err);
    return fallbackTriageReply(lead, businessName, bookingLink, questions);
  }
}

/**
 * The review-request message texted +1 day after a completed job
 * (per the playbook). Short, warm, one ask, one link.
 */
export function reviewRequestMessage(
  businessName: string,
  reviewLink: string,
): string {
  return (
    `Hi! Thanks again for choosing ${businessName}. ` +
    `It was a pleasure working with you. ` +
    `If we earned it, would you mind leaving us a quick review? ` +
    `It takes 30 seconds and means the world to a local business: ${reviewLink}`
  );
}

/* -------------------------------------------------------------------------- */
/* Internals                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_QUALIFYING_QUESTIONS = [
  "What's your ZIP code?",
  "What service do you need?",
  "When works best for you?",
];

interface AnthropicMessageResponse {
  content?: Array<{ type: string; text?: string }>;
}

function extractText(data: AnthropicMessageResponse): string {
  if (!Array.isArray(data.content)) return "";
  return data.content
    .filter((b) => b.type === "text" && typeof b.text === "string")
    .map((b) => b.text as string)
    .join("")
    .trim();
}

function buildTriageSystemPrompt(
  businessName: string,
  bookingLink: string,
  questions: string[],
  config?: SiteConfig,
): string {
  const cities = config?.citiesServed?.length
    ? config.citiesServed.join(", ")
    : "the local area";
  const services = config?.services?.length
    ? config.services.map((s) => s.name).join(", ")
    : "our services";

  return [
    `You are the friendly front-desk assistant for ${businessName}, a local business serving ${cities}.`,
    `Services offered: ${services}.`,
    "",
    "A new lead just came in. Write a single SMS-length reply (under 320 characters) that:",
    "- Greets them warmly by name if a name is available.",
    "- Confirms we got their message and want to help fast.",
    "- Qualifies the lead by naturally asking for anything still missing:",
    questions.map((q) => `    - ${q}`).join("\n"),
    `- Includes this exact booking link once: ${bookingLink}`,
    "",
    "Do NOT invent prices, availability, or promises. Be concise, human, and upbeat.",
    "Return ONLY the message text the customer should receive — no preamble, no quotes, no labels.",
  ].join("\n");
}

function buildTriageUserMessage(lead: Lead): string {
  const lines: string[] = ["New lead details:"];
  if (lead.name) lines.push(`Name: ${lead.name}`);
  lines.push(`Phone: ${lead.phone}`);
  if (lead.zip) lines.push(`ZIP: ${lead.zip}`);
  if (lead.source) lines.push(`Source: ${lead.source}`);
  lines.push(`Message: ${lead.message ?? "(none provided)"}`);
  return lines.join("\n");
}

function fallbackTriageReply(
  lead: Lead,
  businessName: string,
  bookingLink: string,
  questions: string[],
): string {
  const greeting = lead.name ? `Hi ${lead.name}!` : "Hi there!";
  const stillNeed = missingAnswers(lead, questions);
  const ask = stillNeed.length
    ? ` To get you a fast quote, just reply with: ${stillNeed.join(" ")}`
    : " We'll be in touch shortly to lock in the details.";

  return (
    `${greeting} Thanks for reaching out to ${businessName} — ` +
    `we got your message and want to help.` +
    ask +
    ` Or book a time here: ${bookingLink}`
  );
}

/** Skip questions the lead already answered (ZIP, service via message). */
function missingAnswers(lead: Lead, questions: string[]): string[] {
  return questions.filter((q) => {
    const lower = q.toLowerCase();
    if (lower.includes("zip") && lead.zip) return false;
    if (
      (lower.includes("service") || lower.includes("need")) &&
      lead.message &&
      lead.message.trim().length > 0
    ) {
      return false;
    }
    return true;
  });
}

function bookingLinkFor(slug: string, config?: SiteConfig): string {
  if (config?.booking.externalUrl) return config.booking.externalUrl;
  const base = siteBaseUrl();
  return `${base}/sites/${slug}#book`;
}

function siteBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (env) return env;
  return `https://${BRAND.domain}`;
}

function makeLeadId(slug: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `lead_${slug}_${Date.now().toString(36)}${rand}`;
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "***";
  return `***-***-${digits.slice(-4)}`;
}
