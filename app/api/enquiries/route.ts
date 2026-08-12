import { NextResponse } from "next/server";
import { getDb } from "../../../db";
import { enquiries } from "../../../db/schema";

export const dynamic = "force-dynamic";

const allowedSources = new Set(["contact", "property", "valuation", "private-search"]);

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
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
      return NextResponse.json({ error: "Please complete every required field." }, { status: 400 });
    }
    if (!allowedSources.has(source) || body.privacyAccepted !== true) {
      return NextResponse.json({ error: "Please accept the privacy policy." }, { status: 400 });
    }

    const now = new Date();
    const id = crypto.randomUUID();
    const db = await getDb();
    await db.insert(enquiries).values({
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
    });

    return NextResponse.json({ ok: true, reference: `MFS-${id.slice(0, 8).toUpperCase()}` }, { status: 201 });
  } catch (error) {
    console.error("Unable to create enquiry", error);
    return NextResponse.json({ error: "We could not send your enquiry. Please call +34 952 907 386." }, { status: 500 });
  }
}
