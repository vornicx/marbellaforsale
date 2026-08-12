"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ManagedProperty } from "../property-store";

export type StudioLead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  propertyTitle: string | null;
  propertyRef: string | null;
  propertySlug: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  priority: string;
  assignedTo: string | null;
  internalNotes: string | null;
  nextActionAt: string | null;
  viewingAt: string | null;
};

type LeadChanges = Partial<Pick<StudioLead, "status" | "priority" | "assignedTo" | "internalNotes" | "nextActionAt" | "viewingAt">>;
type StudioSection = "overview" | "enquiries" | "viewings" | "properties";

const statusOptions = ["new", "contacted", "qualified", "viewing", "valuation", "closed", "archived"];
const statusLabels: Record<string, string> = {
  new: "New", contacted: "Contacted", qualified: "Qualified", viewing: "Viewing", valuation: "Valuation", closed: "Closed", archived: "Archived",
};
const sourceLabels: Record<string, string> = { property: "Property enquiry", valuation: "Seller valuation", contact: "General enquiry", "private-search": "Private search" };

function CloseIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>; }
function ArrowIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>; }
function SearchIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 4.5 4.5" /></svg>; }
function MailIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" /><path d="m4 7 8 6 8-6" /></svg>; }
function PhoneIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 3.8 4.6 5.1c-.9.5-.9 2.3-.4 3.8 1.7 5.1 5.8 9.2 10.9 10.9 1.5.5 3.3.5 3.8-.4l1.3-2.6-4.3-2.4-1.4 1.8c-2.8-1.2-5.5-3.9-6.7-6.7l1.8-1.4-2.4-4.3Z" /></svg>; }
function MessageIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 9 9 0 0 1-3.6-.8L4 20l1.3-4A7.8 7.8 0 1 1 20 11.5Z" /><path d="M8 9.5c1 2.7 2.8 4.5 5.5 5.5" /></svg>; }

function relativeTime(value: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 2) return "Just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}

function sourceLabel(source: string) { return sourceLabels[source] || source; }

function formatDate(value: string | null, includeTime = true) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", day: "2-digit", month: "short", year: "numeric", ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}) }).format(new Date(value));
}

function toDateInput(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(value)).replace(" ", "T");
}

function fromDateInput(value: string) { return value ? new Date(value).toISOString() : null; }

export function StudioDashboard({ initialLeads, initialProperties, userName, previewMode = false }: { initialLeads: StudioLead[]; initialProperties: ManagedProperty[]; userName: string; previewMode?: boolean }) {
  const [leads, setLeads] = useState(initialLeads);
  const [managedProperties, setManagedProperties] = useState(initialProperties);
  const [section, setSection] = useState<StudioSection>("overview");
  const [statusFilter, setStatusFilter] = useState("open");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  const openLeads = useMemo(() => leads.filter((lead) => !["closed", "archived"].includes(lead.status)), [leads]);
  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) || null;
  const selectedProperty = managedProperties.find((property) => property.id === selectedPropertyId) || null;
  const propertyCount = managedProperties.filter((property) => property.status === "published").length;
  const viewingLeads = useMemo(() => leads.filter((lead) => lead.viewingAt && !["closed", "archived"].includes(lead.status)).sort((a, b) => new Date(a.viewingAt || 0).getTime() - new Date(b.viewingAt || 0).getTime()), [leads]);
  const nextActions = useMemo(() => openLeads.filter((lead) => lead.nextActionAt).sort((a, b) => new Date(a.nextActionAt || 0).getTime() - new Date(b.nextActionAt || 0).getTime()).slice(0, 5), [openLeads]);
  const visibleLeads = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const statusMatch = statusFilter === "all" || (statusFilter === "open" ? !["closed", "archived"].includes(lead.status) : lead.status === statusFilter);
      const sourceMatch = sourceFilter === "all" || lead.source === sourceFilter;
      const priorityMatch = priorityFilter === "all" || lead.priority === priorityFilter;
      const queryMatch = !normalized || [lead.firstName, lead.lastName, lead.email, lead.phone, lead.propertyTitle, lead.propertyRef, lead.message].filter(Boolean).join(" ").toLowerCase().includes(normalized);
      return statusMatch && sourceMatch && priorityMatch && queryMatch;
    }).sort((a, b) => sort === "oldest" ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [leads, priorityFilter, query, sort, sourceFilter, statusFilter]);
  const priorityLeads = (openLeads.filter((lead) => lead.priority === "high").length ? openLeads.filter((lead) => lead.priority === "high") : openLeads).slice(0, 5);

  useEffect(() => {
    if (!selectedLead && !selectedProperty) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelectedLeadId(null); };
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = overflow; window.removeEventListener("keydown", close); };
  }, [selectedLead, selectedProperty]);

  async function updateLead(id: string, changes: LeadChanges) {
    const previous = leads;
    setError("");
    setUpdating(id);
    setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, ...changes, updatedAt: new Date().toISOString() } : lead));
    if (previewMode) { setUpdating(null); return true; }
    try {
      const response = await fetch(`/api/enquiries/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(changes) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "The enquiry could not be updated.");
      return true;
    } catch (updateError) {
      setLeads(previous);
      setError(updateError instanceof Error ? updateError.message : "The enquiry could not be updated.");
      return false;
    } finally {
      setUpdating(null);
    }
  }

  function openEnquiries(filter = "open") { setStatusFilter(filter); setSection("enquiries"); }

  async function saveProperty(property: ManagedProperty) {
    const previous = managedProperties;
    setError("");
    setUpdating(property.id);
    const next = { ...property, updatedAt: new Date().toISOString() };
    setManagedProperties((current) => current.map((item) => item.id === property.id ? next : item));
    if (previewMode) { setUpdating(null); return true; }
    try {
      const response = await fetch(`/api/studio/properties/${encodeURIComponent(property.id)}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(next) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "The property could not be saved.");
      return true;
    } catch (updateError) {
      setManagedProperties(previous);
      setError(updateError instanceof Error ? updateError.message : "The property could not be saved.");
      return false;
    } finally {
      setUpdating(null);
    }
  }

  function createProperty() {
    const id = `new-property-${Date.now()}`;
    const property: ManagedProperty = { id, slug: id, title: "New private residence", location: "Marbella, Málaga", area: "Marbella", type: "Villa", price: 0, priceLabel: "€0", beds: 0, baths: 0, built: 0, image: "/images/properties/r5019220/01.jpg", gallery: ["/images/properties/r5019220/01.jpg"], ref: `MFS-${String(Date.now()).slice(-6)}`, description: "Add the considered property description before publishing this residence.", features: [], status: "draft", featured: false, updatedAt: new Date().toISOString() };
    setManagedProperties((current) => [property, ...current]);
    setSelectedPropertyId(id);
  }

  return <main className="studio">
    <aside className="studio-sidebar">
      <Link href="/" className="wordmark"><strong>MARBELLA</strong><span>FOR SALE</span></Link>
      <nav aria-label="Owner Studio">
        <button className={section === "overview" ? "active" : ""} onClick={() => setSection("overview")}>Overview</button>
        <button className={section === "enquiries" ? "active" : ""} onClick={() => openEnquiries()}>Enquiries <span>{openLeads.length}</span></button>
        <button className={section === "viewings" ? "active" : ""} onClick={() => setSection("viewings")}>Viewings <span>{viewingLeads.length}</span></button>
        <button className={section === "properties" ? "active" : ""} onClick={() => setSection("properties")}>Properties <span>{propertyCount}</span></button>
        <button disabled>Content &amp; SEO <small>Next</small></button>
      </nav>
      <Link href="/">Return to website <ArrowIcon /></Link>
    </aside>

    <section className="studio-main">
      <header className="studio-header"><div><p className="studio-kicker">Marbella For Sale · Owner Studio</p><h1>{section === "overview" ? `Good day, ${userName}.` : section === "enquiries" ? "Enquiry pipeline" : section === "viewings" ? "Private viewings" : "Property portfolio"}</h1><p>{section === "overview" ? "A live view of demand, priorities and next commercial actions." : section === "enquiries" ? "Every website enquiry, its context and its current commercial status." : section === "viewings" ? "Scheduled appointments and the clients behind them." : "Create, review and publish every residence from one considered workspace."}</p></div>{previewMode ? <span className="studio-preview-label">Demonstration workspace</span> : <Link href="/signout-with-chatgpt?return_to=/" className="studio-account" aria-label="Sign out">MF</Link>}</header>
      {previewMode && <div className="studio-preview-note"><span>Secure preview</span><p>Sample enquiries demonstrate the complete owner workflow. No client information is exposed in this public view.</p></div>}
      {error && <p className="studio-alert" role="alert">{error}</p>}

      {section === "overview" && <>
        <div className="studio-kpis">
          <button className="kpi" onClick={() => openEnquiries("new")}><span>New enquiries</span><strong>{leads.filter((lead) => lead.status === "new").length}</strong><small>Awaiting first contact</small><ArrowIcon /></button>
          <button className="kpi" onClick={() => openEnquiries("qualified")}><span>Qualified buyers</span><strong>{leads.filter((lead) => ["qualified", "viewing"].includes(lead.status)).length}</strong><small>Active purchase intent</small><ArrowIcon /></button>
          <button className="kpi" onClick={() => setSection("properties")}><span>Live properties</span><strong>{propertyCount}</strong><small>Published with verified imagery</small><ArrowIcon /></button>
          <button className="kpi" onClick={() => openEnquiries()}><span>Open opportunities</span><strong>{openLeads.length}</strong><small>{leads.filter((lead) => lead.source === "valuation" && !["closed", "archived"].includes(lead.status)).length} seller leads</small><ArrowIcon /></button>
        </div>
        <div className="studio-grid">
          <article className="studio-panel studio-priority"><div className="panel-head"><div><span>Commercial focus</span><h2>Priority enquiries</h2></div><button onClick={() => openEnquiries()}>View pipeline <ArrowIcon /></button></div>
            {priorityLeads.length ? priorityLeads.map((lead) => <LeadRow key={lead.id} lead={lead} updating={updating === lead.id} onOpen={() => setSelectedLeadId(lead.id)} onStatus={(status) => updateLead(lead.id, { status })} />) : <EmptyStudio title="No enquiries yet" copy="New property, valuation and contact requests will appear here instantly." />}
          </article>
          <article className="studio-panel studio-next-actions"><div className="panel-head"><div><span>Follow-up</span><h2>Next actions</h2></div></div>
            {nextActions.length ? <div className="next-action-list">{nextActions.map((lead) => <button type="button" onClick={() => setSelectedLeadId(lead.id)} key={lead.id}><time>{formatDate(lead.nextActionAt)}</time><strong>{lead.firstName} {lead.lastName}</strong><span>{lead.propertyRef || sourceLabel(lead.source)}</span><ArrowIcon /></button>)}</div> : <EmptyStudio title="Nothing scheduled" copy="Set a next action from any enquiry to keep every opportunity moving." />}
          </article>
        </div>
      </>}

      {section === "enquiries" && <section className="studio-panel enquiry-pipeline">
        <div className="pipeline-toolbar"><div><span>Live CRM</span><h2>{visibleLeads.length} {visibleLeads.length === 1 ? "enquiry" : "enquiries"}</h2></div><div className="pipeline-tools">
          <label className="pipeline-search"><span className="sr-only">Search enquiries</span><SearchIcon /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, property or reference" /></label>
          <label><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="open">All open</option><option value="all">All enquiries</option>{statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
          <label><span>Source</span><select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}><option value="all">All sources</option>{Object.entries(sourceLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          <label><span>Priority</span><select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}><option value="all">Any priority</option><option value="high">High</option><option value="normal">Normal</option></select></label>
          <label><span>Order</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
        </div></div>
        <div className="pipeline-table"><div className="pipeline-head"><span>Client</span><span>Interest</span><span>Contact</span><span>Received</span><span>Priority</span><span>Status</span></div>{visibleLeads.map((lead) => <LeadRow key={lead.id} lead={lead} updating={updating === lead.id} onOpen={() => setSelectedLeadId(lead.id)} onStatus={(status) => updateLead(lead.id, { status })} expanded />)}</div>
        {!visibleLeads.length && <EmptyStudio title="No enquiries in this view" copy="Adjust the filters or search another name, property or reference." />}
      </section>}

      {section === "viewings" && <section className="viewings-section">
        <div className="viewings-summary"><span>{viewingLeads.length} scheduled</span><p>Every appointment remains connected to the original enquiry, property and follow-up plan.</p></div>
        {viewingLeads.length ? <div className="viewing-board">{viewingLeads.map((lead) => <button type="button" className="viewing-card" onClick={() => setSelectedLeadId(lead.id)} key={lead.id}><div><span>{formatDate(lead.viewingAt, false)}</span><strong>{new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit" }).format(new Date(lead.viewingAt || ""))}</strong></div><section><small>{lead.propertyRef || "Private appointment"}</small><h2>{lead.propertyTitle || "Confidential property consultation"}</h2><p>{lead.firstName} {lead.lastName} · {lead.phone}</p></section><ArrowIcon /></button>)}</div> : <EmptyStudio title="No viewings scheduled" copy="Open an enquiry and add a viewing date. It will appear here immediately." />}
      </section>}

      {section === "properties" && <PropertyManager properties={managedProperties} onCreate={createProperty} onOpen={(id) => setSelectedPropertyId(id)} />}
    </section>

    {selectedLead && <LeadDrawer key={selectedLead.id} lead={selectedLead} saving={updating === selectedLead.id} onClose={() => setSelectedLeadId(null)} onSave={(changes) => updateLead(selectedLead.id, changes)} />}
    {selectedProperty && <PropertyDrawer key={selectedProperty.id} property={selectedProperty} saving={updating === selectedProperty.id} previewMode={previewMode} onClose={() => setSelectedPropertyId(null)} onSave={saveProperty} />}
  </main>;
}

function LeadRow({ lead, updating, onOpen, onStatus, expanded = false }: { lead: StudioLead; updating: boolean; onOpen: () => void; onStatus: (status: string) => void; expanded?: boolean }) {
  return <div className={`lead-row ${expanded ? "lead-row-expanded" : ""}`}>
    <button className="lead-open" type="button" onClick={onOpen} aria-label={`Open enquiry from ${lead.firstName} ${lead.lastName}`}>
      <div className="lead-person"><strong>{lead.firstName} {lead.lastName}</strong><small>{sourceLabel(lead.source)}</small></div>
      <div className="lead-interest"><strong>{lead.propertyTitle || (lead.source === "valuation" ? "Private valuation" : "Marbella property search")}</strong><small>{lead.propertyRef || lead.message}</small></div>
      {expanded && <div className="lead-contact"><span>{lead.email}</span><span>{lead.phone}</span></div>}
      {expanded && <time dateTime={lead.createdAt} suppressHydrationWarning>{relativeTime(lead.createdAt)}</time>}
      {expanded && <span className={`priority-label priority-${lead.priority}`}>{lead.priority === "high" ? "High" : "Normal"}</span>}
      <ArrowIcon />
    </button>
    <label className={`status-control status-${lead.status}`}><span className="sr-only">Status for {lead.firstName} {lead.lastName}</span><select value={lead.status} disabled={updating} onChange={(event) => onStatus(event.target.value)}>{statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
  </div>;
}

function LeadDrawer({ lead, saving, onClose, onSave }: { lead: StudioLead; saving: boolean; onClose: () => void; onSave: (changes: LeadChanges) => Promise<boolean> }) {
  const [status, setStatus] = useState(lead.status);
  const [priority, setPriority] = useState(lead.priority);
  const [assignedTo, setAssignedTo] = useState(lead.assignedTo || "");
  const [internalNotes, setInternalNotes] = useState(lead.internalNotes || "");
  const [nextActionAt, setNextActionAt] = useState(toDateInput(lead.nextActionAt));
  const [viewingAt, setViewingAt] = useState(toDateInput(lead.viewingAt));
  const whatsapp = lead.phone.replace(/\D/g, "");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave({ status, priority, assignedTo: assignedTo || null, internalNotes: internalNotes || null, nextActionAt: fromDateInput(nextActionAt), viewingAt: fromDateInput(viewingAt) });
  }

  return <div className="studio-drawer-shell">
    <button className="studio-drawer-backdrop" type="button" onClick={onClose} aria-label="Close enquiry" />
    <aside className="studio-drawer" role="dialog" aria-modal="true" aria-labelledby="lead-drawer-title">
      <header><div><span>{sourceLabel(lead.source)} · {relativeTime(lead.createdAt)}</span><h2 id="lead-drawer-title">{lead.firstName}<br />{lead.lastName}</h2></div><button type="button" onClick={onClose} aria-label="Close enquiry"><CloseIcon /></button></header>
      <div className="drawer-actions"><a href={`mailto:${lead.email}`}><MailIcon /> Email</a><a href={`tel:${lead.phone}`}><PhoneIcon /> Call</a><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"><MessageIcon /> WhatsApp</a></div>
      <section className="drawer-context"><span>Enquiry context</span><h3>{lead.propertyTitle || (lead.source === "valuation" ? "Confidential seller valuation" : "Private Marbella property search")}</h3>{lead.propertyRef && <small>{lead.propertyRef}</small>}<p>{lead.message}</p>{lead.propertySlug && <Link href={`/properties/${lead.propertySlug}`}>Open property <ArrowIcon /></Link>}</section>
      <dl className="drawer-contact"><div><dt>Email</dt><dd><a href={`mailto:${lead.email}`}>{lead.email}</a></dd></div><div><dt>Phone</dt><dd><a href={`tel:${lead.phone}`}>{lead.phone}</a></dd></div><div><dt>Received</dt><dd>{formatDate(lead.createdAt)}</dd></div><div><dt>Last updated</dt><dd>{relativeTime(lead.updatedAt)}</dd></div></dl>
      <form className="drawer-form" onSubmit={submit}>
        <div className="drawer-form-grid"><label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}>{statusOptions.map((option) => <option value={option} key={option}>{statusLabels[option]}</option>)}</select></label><label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value)}><option value="normal">Normal</option><option value="high">High</option></select></label></div>
        <label>Assigned to<input value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)} placeholder="Advisor or team" /></label>
        <div className="drawer-form-grid"><label>Next action<input type="datetime-local" value={nextActionAt} onChange={(event) => setNextActionAt(event.target.value)} /></label><label>Private viewing<input type="datetime-local" value={viewingAt} onChange={(event) => { setViewingAt(event.target.value); if (event.target.value && status !== "viewing") setStatus("viewing"); }} /></label></div>
        <label>Internal notes<textarea value={internalNotes} onChange={(event) => setInternalNotes(event.target.value)} placeholder="Context, preferences, budget, next steps…" /></label>
        <button className="drawer-save" type="submit" disabled={saving}>{saving ? "Saving…" : "Save enquiry"}<ArrowIcon /></button>
      </form>
    </aside>
  </div>;
}

function PropertyManager({ properties, onCreate, onOpen }: { properties: ManagedProperty[]; onCreate: () => void; onOpen: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const visible = properties.filter((property) => {
    const search = query.trim().toLowerCase();
    return (status === "all" || property.status === status) && (!search || [property.title, property.location, property.area, property.ref].join(" ").toLowerCase().includes(search));
  });
  const counts = { published: properties.filter((property) => property.status === "published").length, draft: properties.filter((property) => property.status === "draft").length, archived: properties.filter((property) => property.status === "archived").length };

  return <section className="property-manager">
    <div className="property-manager-summary">
      <div><span>Portfolio control</span><h2>{visible.length} residences</h2><p>{counts.published} live · {counts.draft} draft · {counts.archived} archived</p></div>
      <button type="button" onClick={onCreate}>Add property <span>＋</span></button>
    </div>
    <div className="property-manager-toolbar">
      <label className="property-manager-search"><SearchIcon /><span className="sr-only">Search properties</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, area or reference" /></label>
      <div role="group" aria-label="Property status">{["all", "published", "draft", "archived"].map((option) => <button type="button" className={status === option ? "active" : ""} onClick={() => setStatus(option)} key={option}>{option === "all" ? "All" : option}</button>)}</div>
    </div>
    <div className="property-manager-list">
      {visible.map((property) => <button type="button" className="managed-property-card" onClick={() => onOpen(property.id)} key={property.id}>
        <div className="managed-property-image"><img src={property.image} alt="" />{property.featured && <span>Featured</span>}</div>
        <div className="managed-property-copy"><small>{property.ref} · {property.location}</small><h3>{property.title}</h3><p>{property.priceLabel} · {property.beds} beds · {property.built.toLocaleString("en-GB")} m²</p></div>
        <span className={`property-state property-state-${property.status}`}>{property.status}</span><time>{property.updatedAt === new Date(0).toISOString() ? "Original listing" : `Edited ${relativeTime(property.updatedAt)}`}</time><ArrowIcon />
      </button>)}
    </div>
    {!visible.length && <EmptyStudio title="No properties in this view" copy="Adjust the filter or create a new private residence." />}
  </section>;
}

function PropertyDrawer({ property, saving, previewMode, onClose, onSave }: { property: ManagedProperty; saving: boolean; previewMode: boolean; onClose: () => void; onSave: (property: ManagedProperty) => Promise<boolean> }) {
  const [draft, setDraft] = useState(property);
  const [gallery, setGallery] = useState(property.gallery.join("\n"));
  const [features, setFeatures] = useState(property.features.join("\n"));
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const change = <K extends keyof ManagedProperty>(key: K, value: ManagedProperty[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const number = (value: string) => value === "" ? 0 : Number(value);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const galleryItems = gallery.split("\n").map((item) => item.trim()).filter(Boolean);
    const featureItems = features.split("\n").map((item) => item.trim()).filter(Boolean);
    const saved = await onSave({ ...draft, gallery: galleryItems.length ? galleryItems : [draft.image], features: featureItems, priceLabel: new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(draft.price) });
    if (saved) onClose();
  }

  async function addImages(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadError("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files).slice(0, 12)) {
        if (previewMode) {
          urls.push(await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("Image could not be read.")); reader.readAsDataURL(file); }));
        } else {
          const form = new FormData();
          form.set("file", file);
          const response = await fetch("/api/studio/property-images", { method: "POST", body: form });
          const result = await response.json() as { url?: string; error?: string };
          if (!response.ok || !result.url) throw new Error(result.error || "Image could not be uploaded.");
          urls.push(result.url);
        }
      }
      if (urls.length) {
        if (!draft.image || draft.image.includes("r5019220/01.jpg") && property.id.startsWith("new-property-")) change("image", urls[0]);
        setGallery((current) => [...current.split("\n").filter(Boolean), ...urls].join("\n"));
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Images could not be uploaded.");
    } finally {
      setUploading(false);
    }
  }

  return <div className="studio-drawer-shell property-drawer-shell">
    <button className="studio-drawer-backdrop" type="button" onClick={onClose} aria-label="Close property editor" />
    <aside className="studio-drawer property-drawer" role="dialog" aria-modal="true" aria-labelledby="property-drawer-title">
      <header><div><span>{draft.ref} · Property editor</span><h2 id="property-drawer-title">Edit<br />residence</h2></div><button type="button" onClick={onClose} aria-label="Close property editor"><CloseIcon /></button></header>
      <div className="property-editor-preview"><img src={draft.image} alt="Property cover preview" /><div><span className={`property-state property-state-${draft.status}`}>{draft.status}</span><strong>{draft.title}</strong><small>{draft.location}</small></div></div>
      <form className="drawer-form property-editor-form" onSubmit={submit}>
        <div className="drawer-form-grid"><label>Publication status<select value={draft.status} onChange={(event) => change("status", event.target.value as ManagedProperty["status"])}><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label><label className="property-feature-toggle"><span>Homepage selection</span><span><input type="checkbox" checked={draft.featured} onChange={(event) => change("featured", event.target.checked)} /> Featured residence</span></label></div>
        <label>Property title<input required value={draft.title} onChange={(event) => change("title", event.target.value)} /></label>
        <div className="drawer-form-grid"><label>Reference<input required value={draft.ref} onChange={(event) => change("ref", event.target.value.toUpperCase())} /></label><label>Property type<select value={draft.type} onChange={(event) => change("type", event.target.value as ManagedProperty["type"])}><option>Villa</option><option>Penthouse</option><option>Apartment</option><option>Townhouse</option></select></label></div>
        <div className="drawer-form-grid"><label>Location<input required value={draft.location} onChange={(event) => change("location", event.target.value)} /></label><label>Area<input required value={draft.area} onChange={(event) => change("area", event.target.value)} /></label></div>
        <div className="property-numbers"><label>Price (€)<input required min="0" type="number" value={draft.price} onChange={(event) => change("price", number(event.target.value))} /></label><label>Bedrooms<input required min="0" type="number" value={draft.beds} onChange={(event) => change("beds", number(event.target.value))} /></label><label>Bathrooms<input required min="0" step="0.5" type="number" value={draft.baths} onChange={(event) => change("baths", number(event.target.value))} /></label><label>Built m²<input required min="0" type="number" value={draft.built} onChange={(event) => change("built", number(event.target.value))} /></label><label>Plot m²<input min="0" type="number" value={draft.plot || ""} onChange={(event) => change("plot", event.target.value ? number(event.target.value) : undefined)} /></label><label>Terrace m²<input min="0" type="number" value={draft.terrace || ""} onChange={(event) => change("terrace", event.target.value ? number(event.target.value) : undefined)} /></label></div>
        <label className="property-upload"><span>Property photography</span><span className="property-upload-control"><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={(event) => addImages(event.target.files)} /><strong>{uploading ? "Uploading photography…" : "Add original images"}</strong><small>JPG, PNG, WebP or AVIF · up to 12 MB each</small></span>{uploadError && <small className="property-upload-error">{uploadError}</small>}</label>
        <label>Cover image<input required value={draft.image} onChange={(event) => change("image", event.target.value)} /><small>The cover controls the portfolio card and property hero.</small></label>
        <label>Gallery order<textarea value={gallery} onChange={(event) => setGallery(event.target.value)} placeholder="One verified image path per line" /><small>One image per line. Reorder the lines to control the gallery sequence.</small></label>
        <label>Badge<input value={draft.badge || ""} onChange={(event) => change("badge", event.target.value || undefined)} placeholder="Featured, New listing, Beachside…" /></label>
        <label>Description<textarea required value={draft.description} onChange={(event) => change("description", event.target.value)} /></label>
        <label>Key features<textarea value={features} onChange={(event) => setFeatures(event.target.value)} placeholder="One feature per line" /></label>
        <button className="drawer-save" type="submit" disabled={saving}>{saving ? "Saving property…" : draft.status === "published" ? "Save and publish" : "Save property"}<ArrowIcon /></button>
      </form>
    </aside>
  </div>;
}

function EmptyStudio({ title, copy }: { title: string; copy: string }) {
  return <div className="studio-empty"><i /><h3>{title}</h3><p>{copy}</p></div>;
}
