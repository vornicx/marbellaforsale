import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb } from "../../db";
import { enquiries } from "../../db/schema";
import { getChatGPTUser, requireChatGPTUser } from "../chatgpt-auth";
import { properties } from "../data";
import { StudioDashboard, type StudioLead } from "./studio-dashboard";

export const metadata: Metadata = { title: "Owner Studio", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "";
  const user = await getChatGPTUser();
  const isPublicPreview = host.includes("vercel.app") || host.startsWith("terminal.local") || process.env.VERCEL === "1";

  if (!user && isPublicPreview) {
    return <StudioDashboard initialLeads={demoLeads} propertyCount={properties.length} userName="Marbella team" previewMode />;
  }

  const authenticatedUser = user || await requireChatGPTUser("/studio");
  const db = await getDb();
  const records = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt)).limit(250);
  const leads: StudioLead[] = records.map((lead) => ({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
    nextActionAt: lead.nextActionAt?.toISOString() || null,
    viewingAt: lead.viewingAt?.toISOString() || null,
    propertySlug: properties.find((property) => property.ref === lead.propertyRef)?.slug || null,
  }));

  return <StudioDashboard initialLeads={leads} propertyCount={properties.length} userName={authenticatedUser.fullName || "Marbella team"} />;
}

const demoLeads: StudioLead[] = [
  { id: "demo-1", createdAt: new Date(Date.now() - 18 * 60_000).toISOString(), updatedAt: new Date(Date.now() - 18 * 60_000).toISOString(), source: "property", propertyTitle: "Contemporary Villa in El Madroñal", propertyRef: "R5019220", propertySlug: "r5019220-el-madronal-villa", firstName: "Sophie", lastName: "Laurent", email: "sophie@example.com", phone: "+33 6 00 00 00 00", message: "I would like to arrange a private viewing during my next visit to Marbella.", status: "new", priority: "high", assignedTo: null, internalNotes: null, nextActionAt: new Date(Date.now() + 2 * 60 * 60_000).toISOString(), viewingAt: null },
  { id: "demo-2", createdAt: new Date(Date.now() - 74 * 60_000).toISOString(), updatedAt: new Date(Date.now() - 32 * 60_000).toISOString(), source: "property", propertyTitle: "Villa in Parcelas del Golf", propertyRef: "R5421445", propertySlug: "r5421445-nueva-andalucia-villa", firstName: "James", lastName: "Whitmore", email: "james@example.com", phone: "+44 7700 900000", message: "Please send the complete property dossier and viewing availability.", status: "viewing", priority: "high", assignedTo: "Marbella sales", internalNotes: "Client will be in Marbella for three days. Prefers a morning appointment.", nextActionAt: new Date(Date.now() + 20 * 60 * 60_000).toISOString(), viewingAt: new Date(Date.now() + 50 * 60 * 60_000).toISOString() },
  { id: "demo-3", createdAt: new Date(Date.now() - 3 * 60 * 60_000).toISOString(), updatedAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(), source: "valuation", propertyTitle: null, propertyRef: null, propertySlug: null, firstName: "Amelia", lastName: "Costa", email: "amelia@example.com", phone: "+34 600 000 000", message: "I am considering selling a Golden Mile apartment and would value a confidential appraisal.", status: "valuation", priority: "high", assignedTo: null, internalNotes: null, nextActionAt: new Date(Date.now() + 26 * 60 * 60_000).toISOString(), viewingAt: null },
  { id: "demo-4", createdAt: new Date(Date.now() - 26 * 60 * 60_000).toISOString(), updatedAt: new Date(Date.now() - 22 * 60 * 60_000).toISOString(), source: "contact", propertyTitle: null, propertyRef: null, propertySlug: null, firstName: "Erik", lastName: "van Dijk", email: "erik@example.com", phone: "+31 6 00000000", message: "We are relocating and would like help defining a private search in Benahavís.", status: "contacted", priority: "normal", assignedTo: "Private search", internalNotes: null, nextActionAt: null, viewingAt: null },
];
