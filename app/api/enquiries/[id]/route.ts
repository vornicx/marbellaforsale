import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getChatGPTUser } from "../../../chatgpt-auth";
import { getDb } from "../../../../db";
import { enquiries } from "../../../../db/schema";

export const dynamic = "force-dynamic";

const allowedStatuses = new Set(["new", "contacted", "qualified", "viewing", "valuation", "closed", "archived"]);
const allowedPriorities = new Set(["normal", "high"]);

function cleanOptional(value: unknown, maxLength: number) {
  if (value === null) return null;
  return typeof value === "string" ? value.trim().slice(0, maxLength) || null : undefined;
}

function parseOptionalDate(value: unknown) {
  if (value === null || value === "") return null;
  if (typeof value !== "string") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await params;
  const body = await request.json() as Record<string, unknown>;
  const updates: Partial<typeof enquiries.$inferInsert> = { updatedAt: new Date() };

  if ("status" in body) {
    if (typeof body.status !== "string" || !allowedStatuses.has(body.status)) return NextResponse.json({ error: "Invalid enquiry status." }, { status: 400 });
    updates.status = body.status;
  }
  if ("priority" in body) {
    if (typeof body.priority !== "string" || !allowedPriorities.has(body.priority)) return NextResponse.json({ error: "Invalid priority." }, { status: 400 });
    updates.priority = body.priority;
  }
  if ("assignedTo" in body) {
    const assignedTo = cleanOptional(body.assignedTo, 120);
    if (assignedTo === undefined) return NextResponse.json({ error: "Invalid assignee." }, { status: 400 });
    updates.assignedTo = assignedTo;
  }
  if ("internalNotes" in body) {
    const internalNotes = cleanOptional(body.internalNotes, 5000);
    if (internalNotes === undefined) return NextResponse.json({ error: "Invalid notes." }, { status: 400 });
    updates.internalNotes = internalNotes;
  }
  if ("nextActionAt" in body) {
    const nextActionAt = parseOptionalDate(body.nextActionAt);
    if (nextActionAt === undefined) return NextResponse.json({ error: "Invalid next action date." }, { status: 400 });
    updates.nextActionAt = nextActionAt;
  }
  if ("viewingAt" in body) {
    const viewingAt = parseOptionalDate(body.viewingAt);
    if (viewingAt === undefined) return NextResponse.json({ error: "Invalid viewing date." }, { status: 400 });
    updates.viewingAt = viewingAt;
  }

  if (Object.keys(updates).length === 1) return NextResponse.json({ error: "No valid changes supplied." }, { status: 400 });

  const db = await getDb();
  await db.update(enquiries).set(updates).where(eq(enquiries.id, id));
  return NextResponse.json({ ok: true });
}
