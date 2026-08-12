import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getChatGPTUser } from "../../../chatgpt-auth";
import { getDb } from "../../../../db";
import { enquiries } from "../../../../db/schema";

export const dynamic = "force-dynamic";

const allowedStatuses = new Set(["new", "contacted", "qualified", "viewing", "valuation", "closed", "archived"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await params;
  const body = await request.json() as { status?: unknown };
  const status = typeof body.status === "string" ? body.status : "";
  if (!allowedStatuses.has(status)) {
    return NextResponse.json({ error: "Invalid enquiry status." }, { status: 400 });
  }

  const db = await getDb();
  await db.update(enquiries).set({ status, updatedAt: new Date() }).where(eq(enquiries.id, id));
  return NextResponse.json({ ok: true });
}
