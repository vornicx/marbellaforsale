import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { getDb } from "../../db";
import { enquiries } from "../../db/schema";
import { requireChatGPTUser } from "../chatgpt-auth";
import { properties } from "../data";
import { StudioDashboard, type StudioLead } from "./studio-dashboard";

export const metadata: Metadata = { title: "Owner Studio", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const user = await requireChatGPTUser("/studio");
  const db = await getDb();
  const records = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(250);
  const leads: StudioLead[] = records.map((lead) => ({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  }));

  return <StudioDashboard initialLeads={leads} propertyCount={properties.length} userName={user.fullName || "Marbella team"} />;
}
