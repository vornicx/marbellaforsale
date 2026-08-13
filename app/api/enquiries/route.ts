import { NextResponse } from "next/server";
import { getDb } from "../../../db";
import { enquiries } from "../../../db/schema";

export const dynamic = "force-dynamic";

const allowedSources = new Set(["contact", "property", "valuation", "private-search"]);

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

const responseHeaders = { "cache-control": "no-store, max-age=0" };

function enquiryReference(id: string) {
  return `MFS-${id.replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

async function notifyByEmail(enquiry: {
  id: string; source: string; propertyTitle: string | null; propertyRef: string | null;
  firstName: string; lastName: string; email: string; phone: string; message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const to = process.env.ENQUIRY_NOTIFICATION_EMAIL || "info@marbellaforsale.com";
  const from = process.env.ENQUIRY_FROM_EMAIL || "Marbella For Sale <enquiries@marbellaforsale.com>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    signal: AbortSignal.timeout(8_000),
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from, to: [to], reply_to: enquiry.email,
      subject: `${enquiryReference(enquiry.id)} · ${enquiry.firstName} ${enquiry.lastName}`,
      text: [
        `Reference: ${enquiryReference(enquiry.id)}`,
        `Source: ${enquiry.source}`,
        enquiry.propertyTitle ? `Property: ${enquiry.propertyTitle}` : "",
        enquiry.propertyRef ? `Property reference: ${enquiry.propertyRef}` : "",
        `Client: ${enquiry.firstName} ${enquiry.lastName}`,
        `Email: ${enquiry.email}`,
        `Phone: ${enquiry.phone}`,
        "", enquiry.message,
      ].filter(Boolean).join("\n"),
    }),
  });
  return response.ok;
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 16_000) {
      return NextResponse.json({ error: "This enquiry is too long. Please shorten your message." }, { status: 413, headers: responseHeaders });
    }
    const body = await request.json() as Record<string, unknown>;
    const firstName = clean(body.firstName, 80);
    const lastName = clean(body.lastName, 80);
    const email = clean(body.email, 160).toLowerCase();
    const phone = clean(body.phone, 50);
    const message = clean(body.message, 3000);
    const source = clean(body.source, 40);
    const propertyTitle = clean(body.propertyTitle, 180) || null;
    const propertyRef = clean(body.propertyRef, 40) || null;

    if (!firstName || !lastName || !phone || !message || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Please complete every required field." }, { status: 400, headers: responseHeaders });
    }
    if (!allowedSources.has(source) || body.privacyAccepted !== true) {
      return NextResponse.json({ error: "Please accept the privacy policy." }, { status: 400, headers: responseHeaders });
    }

    const now = new Date();
    const suppliedId = clean(body.submissionId, 64);
    const id = /^[0-9a-f-]{36}$/i.test(suppliedId) ? suppliedId : crypto.randomUUID();
    if (process.env.NODE_ENV !== "production" && request.headers.get("x-mfs-e2e") === "1") {
      return NextResponse.json({ ok: true, id, reference: enquiryReference(id), test: true }, { status: 201, headers: responseHeaders });
    }
    const values = {
      id,
      createdAt: now,
      updatedAt: now,
      source,
      propertyTitle,
      propertyRef,
      firstName,
      lastName,
      email,
      phone,
      message,
      status: "new",
      priority: source === "property" || source === "valuation" ? "high" : "normal",
    } as const;

    try {
      const db = await getDb();
      await db.insert(enquiries).values(values).onConflictDoNothing({ target: enquiries.id });
    } catch (databaseError) {
      const emailed = await notifyByEmail({ id, source, propertyTitle, propertyRef, firstName, lastName, email, phone, message });
      if (!emailed) throw databaseError;
    }

    return NextResponse.json({ ok: true, id, reference: enquiryReference(id) }, { status: 201, headers: responseHeaders });
  } catch (error) {
    console.error("Unable to create enquiry", error);
    return NextResponse.json({
      error: "The secure enquiry service is temporarily unavailable.",
      fallback: { email: "info@marbellaforsale.com", phone: "+34 952 907 386" },
    }, { status: 503, headers: { ...responseHeaders, "retry-after": "60" } });
  }
}
