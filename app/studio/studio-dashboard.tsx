"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type StudioLead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  propertyTitle: string | null;
  propertyRef: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  priority: string;
  assignedTo: string | null;
};

const statusOptions = ["new", "contacted", "qualified", "viewing", "valuation", "closed", "archived"];
const statusLabels: Record<string, string> = {
  new: "New", contacted: "Contacted", qualified: "Qualified", viewing: "Viewing", valuation: "Valuation", closed: "Closed", archived: "Archived",
};

function relativeTime(value: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 2) return "Just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}

function sourceLabel(source: string) {
  return ({ property: "Property enquiry", valuation: "Seller valuation", contact: "General enquiry", "private-search": "Private search" } as Record<string, string>)[source] || source;
}

export function StudioDashboard({ initialLeads, propertyCount, userName, previewMode = false }: { initialLeads: StudioLead[]; propertyCount: number; userName: string; previewMode?: boolean }) {
  const [leads, setLeads] = useState(initialLeads);
  const [section, setSection] = useState<"overview" | "enquiries">("overview");
  const [filter, setFilter] = useState("open");
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");
  const openLeads = useMemo(() => leads.filter((lead) => !["closed", "archived"].includes(lead.status)), [leads]);
  const visibleLeads = useMemo(() => filter === "all" ? leads : filter === "open" ? openLeads : leads.filter((lead) => lead.status === filter), [filter, leads, openLeads]);
  const highPriority = openLeads.filter((lead) => lead.priority === "high").slice(0, 5);
  const priorityLeads = (highPriority.length ? highPriority : openLeads).slice(0, 5);

  async function updateStatus(id: string, status: string) {
    if (previewMode) {
      setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status, updatedAt: new Date().toISOString() } : lead));
      return;
    }
    const previous = leads;
    setError("");
    setUpdating(id);
    setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status, updatedAt: new Date().toISOString() } : lead));
    try {
      const response = await fetch(`/api/enquiries/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) });
      if (!response.ok) throw new Error("The status could not be saved.");
    } catch (statusError) {
      setLeads(previous);
      setError(statusError instanceof Error ? statusError.message : "The status could not be saved.");
    } finally {
      setUpdating(null);
    }
  }

  return <main className="studio">
    <aside className="studio-sidebar">
      <Link href="/" className="wordmark"><strong>MARBELLA</strong><span>FOR SALE</span></Link>
      <nav aria-label="Owner Studio">
        <button className={section === "overview" ? "active" : ""} onClick={() => setSection("overview")}>Overview</button>
        <button className={section === "enquiries" ? "active" : ""} onClick={() => setSection("enquiries")}>Enquiries <span>{openLeads.length}</span></button>
        <button disabled>Properties <small>Next</small></button>
        <button disabled>Viewings <small>Next</small></button>
        <button disabled>Content &amp; SEO <small>Next</small></button>
      </nav>
      <Link href="/">← Return to website</Link>
    </aside>
    <section className="studio-main">
      <header className="studio-header"><div><p className="studio-kicker">Marbella For Sale · Owner Studio</p><h1>{section === "overview" ? `Good day, ${userName}.` : "Enquiry pipeline"}</h1><p>{section === "overview" ? "A live view of buyer and seller demand across your portfolio." : "Every website enquiry, its context and its current commercial status."}</p></div>{previewMode ? <span className="studio-preview-label">Demonstration workspace</span> : <Link href="/signout-with-chatgpt?return_to=/" className="studio-account" aria-label="Sign out">MF</Link>}</header>
      {previewMode && <div className="studio-preview-note"><span>Secure preview</span><p>Sample enquiries are shown to demonstrate the owner experience. No client information is exposed in this public view.</p></div>}
      {error && <p className="studio-alert" role="alert">{error}</p>}

      {section === "overview" ? <>
        <div className="studio-kpis">
          <article className="kpi"><span>New enquiries</span><strong>{leads.filter((lead) => lead.status === "new").length}</strong><small>Awaiting first contact</small></article>
          <article className="kpi"><span>Qualified buyers</span><strong>{leads.filter((lead) => ["qualified", "viewing"].includes(lead.status)).length}</strong><small>Active purchase intent</small></article>
          <article className="kpi"><span>Live properties</span><strong>{propertyCount}</strong><small>Published with verified imagery</small></article>
          <article className="kpi"><span>Open opportunities</span><strong>{openLeads.length}</strong><small>{leads.filter((lead) => lead.source === "valuation" && !["closed", "archived"].includes(lead.status)).length} seller leads</small></article>
        </div>
        <div className="studio-grid">
          <article className="studio-panel studio-priority"><div className="panel-head"><div><span>Commercial focus</span><h2>Priority enquiries</h2></div><button onClick={() => setSection("enquiries")}>View pipeline →</button></div>
            {priorityLeads.length ? priorityLeads.map((lead) => <LeadRow key={lead.id} lead={lead} updating={updating === lead.id} onStatus={updateStatus} />) : <EmptyStudio title="No enquiries yet" copy="New property, valuation and contact requests will appear here instantly." />}
          </article>
          <article className="studio-panel"><div className="panel-head"><div><span>Live signal</span><h2>Recent activity</h2></div></div><div className="activity-list">
            {leads.slice(0, 5).map((lead) => <div className="activity" key={lead.id}><i /><p><strong>{sourceLabel(lead.source)}</strong><br />{lead.firstName} {lead.lastName}{lead.propertyRef ? ` · ${lead.propertyRef}` : ""}<br /><small>{relativeTime(lead.createdAt)}</small></p></div>)}
            {!leads.length && <EmptyStudio title="Waiting for the first signal" copy="Activity is recorded as soon as a visitor completes an enquiry." />}
          </div></article>
        </div>
      </> : <section className="studio-panel enquiry-pipeline">
        <div className="pipeline-toolbar"><div><span>Live CRM</span><h2>{visibleLeads.length} {visibleLeads.length === 1 ? "enquiry" : "enquiries"}</h2></div><label>Status<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="open">All open</option><option value="all">All enquiries</option>{statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label></div>
        <div className="pipeline-table"><div className="pipeline-head"><span>Client</span><span>Interest</span><span>Contact</span><span>Received</span><span>Status</span></div>{visibleLeads.map((lead) => <LeadRow key={lead.id} lead={lead} updating={updating === lead.id} onStatus={updateStatus} expanded />)}</div>
        {!visibleLeads.length && <EmptyStudio title="No enquiries in this view" copy="Change the status filter or wait for a new website enquiry." />}
      </section>}
    </section>
  </main>;
}

function LeadRow({ lead, updating, onStatus, expanded = false }: { lead: StudioLead; updating: boolean; onStatus: (id: string, status: string) => void; expanded?: boolean }) {
  return <div className={`lead-row ${expanded ? "lead-row-expanded" : ""}`}>
    <div className="lead-person"><strong>{lead.firstName} {lead.lastName}</strong><small>{sourceLabel(lead.source)}</small></div>
    <div className="lead-interest"><strong>{lead.propertyTitle || (lead.source === "valuation" ? "Private valuation" : "Marbella property search")}</strong><small>{lead.propertyRef || lead.message}</small></div>
    {expanded && <div className="lead-contact"><a href={`mailto:${lead.email}`}>{lead.email}</a><a href={`tel:${lead.phone}`}>{lead.phone}</a></div>}
    {expanded && <time dateTime={lead.createdAt}>{relativeTime(lead.createdAt)}</time>}
    <label className={`status-control status-${lead.status}`}><span className="sr-only">Status for {lead.firstName} {lead.lastName}</span><select value={lead.status} disabled={updating} onChange={(event) => onStatus(lead.id, event.target.value)}>{statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
  </div>;
}

function EmptyStudio({ title, copy }: { title: string; copy: string }) {
  return <div className="studio-empty"><i /><h3>{title}</h3><p>{copy}</p></div>;
}
