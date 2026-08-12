"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Property } from "./data";

export function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path className={filled ? "filled" : ""} d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" /></svg>;
}

export function Header({ transparent = false, morphLogo = false }: { transparent?: boolean; morphLogo?: boolean }) {
  const [open, setOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const refresh = () => {
      try { setSavedCount(JSON.parse(localStorage.getItem("mfs-saved") || "[]").length); } catch { setSavedCount(0); }
    };
    const timer = window.setTimeout(refresh, 0);
    window.addEventListener("mfs:saved", refresh);
    return () => { window.clearTimeout(timer); window.removeEventListener("mfs:saved", refresh); };
  }, []);
  useEffect(() => {
    if (!morphLogo) return;
    const header = headerRef.current;
    const logo = logoRef.current;
    const media = document.querySelector<HTMLElement>(".hero-media");
    const content = document.querySelector<HTMLElement>(".hero-content");
    const cue = document.querySelector<HTMLElement>(".scroll-cue");
    if (!header || !logo) return;
    let frame = 0;
    let targetScroll = window.scrollY;
    let renderedScroll = targetScroll;
    const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
    const easeInOutCubic = (value: number) => value < .5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
    const render = () => {
      renderedScroll += (targetScroll - renderedScroll) * .14;
      if (Math.abs(targetScroll - renderedScroll) < .08) renderedScroll = targetScroll;
      const mobile = window.innerWidth <= 800;
      const startTop = window.innerHeight * (mobile ? .27 : .29);
      const endTop = mobile ? 20 : 29;
      const distance = mobile ? 300 : 430;
      const linear = clamp(renderedScroll / distance);
      const progress = easeInOutCubic(linear);
      const startScale = mobile ? 2.65 : 4.2;
      logo.style.top = `${startTop + (endTop - startTop) * progress}px`;
      logo.style.transform = `translate3d(-50%, 0, 0) scale(${startScale + (1 - startScale) * progress})`;
      header.classList.toggle("is-scrolled", linear > .96);
      header.style.setProperty("--motion-progress", linear.toFixed(4));
      const heroProgress = clamp(renderedScroll / Math.max(window.innerHeight * .72, 1));
      if (media) media.style.transform = `translate3d(0, ${heroProgress * 28}px, 0) scale(${1 + heroProgress * .045})`;
      if (content) {
        content.style.opacity = `${clamp(1 - linear * 1.38)}`;
        content.style.transform = `translate3d(0, ${linear * -18}px, 0)`;
      }
      if (cue) cue.style.opacity = `${clamp(1 - linear * 1.45)}`;
      if (Math.abs(targetScroll - renderedScroll) >= .08) frame = window.requestAnimationFrame(render);
      else frame = 0;
    };
    const requestUpdate = () => {
      targetScroll = window.scrollY;
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    render();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [morphLogo]);
  return (
    <header ref={headerRef} className={`site-header ${transparent ? "is-transparent" : ""} ${morphLogo ? "is-morphing" : ""} ${open ? "menu-is-open" : ""}`}>
      <div className="header-inner">
        <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Open navigation">
          <span /><span />
        </button>
        <Link ref={logoRef} href="/" className={`wordmark ${morphLogo ? "morph-wordmark" : ""}`} aria-label="Marbella For Sale home">
          <strong>MARBELLA</strong><span>FOR SALE</span>
        </Link>
        <nav className={open ? "nav-open" : ""} aria-label="Primary navigation">
          <button className="nav-close" onClick={() => setOpen(false)} aria-label="Close navigation">×</button>
          <Link href="/properties" onClick={() => setOpen(false)}>Properties</Link>
          <Link href="/developments" onClick={() => setOpen(false)}>New developments</Link>
          <Link href="/areas" onClick={() => setOpen(false)}>Areas</Link>
          <Link href="/sell" onClick={() => setOpen(false)}>Sell with us</Link>
          <Link href="/guides" onClick={() => setOpen(false)}>Insights</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
        </nav>
        <div className="header-actions">
          <button className="language" type="button" aria-label="Change language">EN <span>⌄</span></button>
          <Link href="/properties?saved=true" className="saved-link" aria-label={`${savedCount} saved properties`}><HeartIcon />{savedCount > 0 && <span>{savedCount}</span>}</Link>
          <Link href="/contact" className="header-contact">Speak to us</Link>
        </div>
      </div>
    </header>
  );
}

export function LuxuryMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section:not(.hero)"));
    root.classList.add("motion-enabled");
    sections.forEach((section) => {
      section.classList.add("reveal-target");
      section.querySelectorAll<HTMLElement>(".property-card, .area-row, .market-stats > div, .signature-points > span, .seller-services > span").forEach((item, index) => {
        item.style.setProperty("--reveal-delay", `${Math.min(index * 85, 340)}ms`);
      });
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: .1, rootMargin: "0px 0px -7% 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      root.classList.remove("motion-enabled");
    };
  }, []);
  return null;
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top shell">
        <div className="footer-brand">
          <Link href="/" className="wordmark footer-wordmark"><strong>MARBELLA</strong><span>FOR SALE</span></Link>
          <p>Exceptional property.<br />Personal service.<br />Local perspective.</p>
        </div>
        <div className="footer-column"><span>Explore</span><Link href="/properties">Property search</Link><Link href="/developments">New developments</Link><Link href="/areas">Area guides</Link><Link href="/guides">Buyer&apos;s guides</Link></div>
        <div className="footer-column"><span>Company</span><Link href="/about">About us</Link><Link href="/sell">Sell a property</Link><Link href="/contact">Contact</Link><Link href="/studio">Owner studio</Link></div>
        <div className="footer-column contact-column"><span>Visit us</span><p>Edificio Marina Banús, Bl. 4 Local 8<br />Calle Francisco Villalón<br />29660 Puerto Banús, Marbella</p><a href="tel:+34952907386">+34 952 907 386</a><a href="mailto:info@marbellaforsale.com">info@marbellaforsale.com</a></div>
      </div>
      <div className="footer-bottom shell"><span>© 2026 Marbella For Sale S.L.</span><div><Link href="/privacy">Privacy</Link><Link href="/privacy">Cookies</Link><Link href="/privacy">Legal</Link></div><span>ES · EN · FR · DE · NL</span></div>
    </footer>
  );
}

export function SearchPanel() {
  return (
    <form className="search-panel" action="/properties">
      <label><span>Location</span><select name="area" defaultValue=""><option value="">All prime areas</option><option>Golden Mile</option><option>Nueva Andalucia</option><option>Benahavis</option><option>Puerto Banus</option><option>Sierra Blanca</option></select></label>
      <label><span>Property type</span><select name="type" defaultValue=""><option value="">All properties</option><option>Villa</option><option>Penthouse</option><option>Apartment</option><option>Townhouse</option></select></label>
      <label><span>Price from</span><select name="min" defaultValue=""><option value="">Any price</option><option value="1000000">€1M</option><option value="2500000">€2.5M</option><option value="5000000">€5M</option></select></label>
      <label><span>Price to</span><select name="max" defaultValue=""><option value="">No limit</option><option value="2500000">€2.5M</option><option value="5000000">€5M</option><option value="10000000">€10M</option></select></label>
      <button type="submit"><span>Search properties</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg></button>
    </form>
  );
}

export function PropertyCard({ property, priority = false, showCompare = false, compared = false, onCompare }: { property: Property; priority?: boolean; showCompare?: boolean; compared?: boolean; onCompare?: (property: Property) => void }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    let stored = false;
    try { stored = JSON.parse(localStorage.getItem("mfs-saved") || "[]").includes(property.slug); } catch { /* ignored */ }
    const timer = window.setTimeout(() => setSaved(stored), 0);
    return () => window.clearTimeout(timer);
  }, [property.slug]);
  function toggleSaved() {
    const current: string[] = JSON.parse(localStorage.getItem("mfs-saved") || "[]");
    const next = current.includes(property.slug) ? current.filter((item) => item !== property.slug) : [...current, property.slug];
    localStorage.setItem("mfs-saved", JSON.stringify(next));
    setSaved(next.includes(property.slug));
    window.dispatchEvent(new Event("mfs:saved"));
  }
  return (
    <article className={`property-card ${property.badge ? "has-badge" : ""}`}>
      <Link href={`/properties/${property.slug}`} className="property-image">
        <img src={property.image} alt={`${property.title}, ${property.location}`} loading={priority ? "eager" : "lazy"} />
        {property.badge && <span className="property-badge">{property.badge}</span>}
        <span className="view-property">View residence <ArrowIcon /></span>
      </Link>
      <button className={`save-button ${saved ? "is-saved" : ""}`} onClick={toggleSaved} aria-label={saved ? "Remove from saved properties" : "Save property"}><HeartIcon filled={saved} /></button>
      {showCompare && <button className={`compare-button ${compared ? "is-compared" : ""}`} type="button" onClick={() => onCompare?.(property)}><span>{compared ? "✓" : "+"}</span>{compared ? "Added" : "Compare"}</button>}
      <div className="property-info">
        <div><p>{property.location}</p><h3><Link href={`/properties/${property.slug}`}>{property.title}</Link></h3></div>
        <strong>{property.priceLabel}</strong>
      </div>
      <div className="property-specs"><span>{property.beds} beds</span><i /><span>{property.baths} baths</span><i /><span>{property.built.toLocaleString("en-GB")} m²</span><span className="property-ref">{property.ref}</span></div>
    </article>
  );
}

type PropertyFilters = { area?: string; type?: string; min?: string; max?: string; beds?: string; saved?: boolean };

export function PropertyResults({ properties, initialFilters = {} }: { properties: Property[]; initialFilters?: PropertyFilters }) {
  const [area, setArea] = useState(initialFilters.area || "");
  const [type, setType] = useState(initialFilters.type || "");
  const [min, setMin] = useState(initialFilters.min || "");
  const [max, setMax] = useState(initialFilters.max || "");
  const [beds, setBeds] = useState(initialFilters.beds || "");
  const [savedOnly, setSavedOnly] = useState(Boolean(initialFilters.saved));
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(Boolean(initialFilters.min || initialFilters.max || initialFilters.beds || initialFilters.saved));
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [compared, setCompared] = useState<Property[]>([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  useEffect(() => {
    const refresh = () => {
      try { setSavedSlugs(JSON.parse(localStorage.getItem("mfs-saved") || "[]")); } catch { setSavedSlugs([]); }
    };
    const timer = window.setTimeout(refresh, 0);
    window.addEventListener("mfs:saved", refresh);
    return () => { window.clearTimeout(timer); window.removeEventListener("mfs:saved", refresh); };
  }, []);
  useEffect(() => {
    const params = new URLSearchParams();
    if (area) params.set("area", area);
    if (type) params.set("type", type);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    if (beds) params.set("beds", beds);
    if (savedOnly) params.set("saved", "true");
    window.history.replaceState(null, "", `${window.location.pathname}${params.size ? `?${params}` : ""}`);
  }, [area, type, min, max, beds, savedOnly]);
  const result = useMemo(() => {
    const filtered = properties.filter((p) =>
      (!area || p.area === area) &&
      (!type || p.type === type) &&
      (!min || p.price >= Number(min)) &&
      (!max || p.price <= Number(max)) &&
      (!beds || p.beds >= Number(beds)) &&
      (!savedOnly || savedSlugs.includes(p.slug))
    );
    if (sort === "high") return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "low") return [...filtered].sort((a, b) => a.price - b.price);
    return filtered;
  }, [area, type, min, max, beds, savedOnly, savedSlugs, sort, properties]);
  function resetFilters() { setArea(""); setType(""); setMin(""); setMax(""); setBeds(""); setSavedOnly(false); }
  function toggleCompare(property: Property) {
    setCompared((current) => current.some((item) => item.slug === property.slug) ? current.filter((item) => item.slug !== property.slug) : current.length < 3 ? [...current, property] : current);
  }
  return (
    <>
      <div className="catalog-toolbar">
        <div className="catalog-filters">
          <label>Area<select value={area} onChange={(e) => setArea(e.target.value)}><option value="">All areas</option>{[...new Set(properties.map((p) => p.area))].map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Type<select value={type} onChange={(e) => setType(e.target.value)}><option value="">All types</option>{[...new Set(properties.map((p) => p.type))].map((item) => <option key={item}>{item}</option>)}</select></label>
          <button className={`more-filter ${showMore ? "is-open" : ""}`} type="button" onClick={() => setShowMore(!showMore)} aria-expanded={showMore}>Price &amp; bedrooms <span>{showMore ? "−" : "+"}</span></button>
        </div>
        <div className="catalog-controls"><span>{result.length} {result.length === 1 ? "residence" : "residences"}</span><label>Sort<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="high">Price: high to low</option><option value="low">Price: low to high</option></select></label><button onClick={() => setView(view === "grid" ? "list" : "grid")} aria-label="Change layout">{view === "grid" ? "▦" : "☰"}</button></div>
      </div>
      {showMore && <div className="advanced-filters">
        <label>Minimum price<select value={min} onChange={(e) => setMin(e.target.value)}><option value="">No minimum</option><option value="1000000">€1,000,000</option><option value="2500000">€2,500,000</option><option value="5000000">€5,000,000</option><option value="7500000">€7,500,000</option></select></label>
        <label>Maximum price<select value={max} onChange={(e) => setMax(e.target.value)}><option value="">No maximum</option><option value="2500000">€2,500,000</option><option value="5000000">€5,000,000</option><option value="7500000">€7,500,000</option><option value="10000000">€10,000,000</option></select></label>
        <label>Bedrooms<select value={beds} onChange={(e) => setBeds(e.target.value)}><option value="">Any</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option><option value="5">5+</option><option value="6">6+</option></select></label>
        <label className="saved-toggle"><input type="checkbox" checked={savedOnly} onChange={(e) => setSavedOnly(e.target.checked)} /><span>Only my saved properties</span></label>
        <button type="button" onClick={resetFilters}>Clear all</button>
      </div>}
      <div className={`property-grid catalog-grid ${view === "list" ? "is-list" : ""}`}>{result.map((property) => <PropertyCard property={property} showCompare compared={compared.some((item) => item.slug === property.slug)} onCompare={toggleCompare} key={property.slug} />)}</div>
      {result.length === 0 && <div className="empty-state"><h3>{savedOnly ? "Your shortlist is waiting." : "No exact matches — yet."}</h3><p>{savedOnly ? "Save the properties you love and they will appear here." : "Our advisors can search the entire market against your brief."}</p>{savedOnly ? <button className="button button-dark" onClick={resetFilters}>Explore all properties <ArrowIcon /></button> : <Link className="button button-dark" href="/contact">Start a private search <ArrowIcon /></Link>}</div>}
      {compared.length > 0 && <div className="comparison-tray" role="region" aria-label="Property comparison"><div><span>Compare residences</span><strong>{compared.map((item) => item.title).join(" · ")}</strong></div><div className="comparison-actions"><button type="button" onClick={() => setCompared([])}>Clear</button><button type="button" className="button button-light" disabled={compared.length < 2} onClick={() => setComparisonOpen(true)}>Compare {compared.length} homes <ArrowIcon /></button></div></div>}
      {comparisonOpen && <div className="comparison-modal" role="dialog" aria-modal="true" aria-labelledby="comparison-title"><button className="modal-backdrop" onClick={() => setComparisonOpen(false)} aria-label="Close comparison" /><div className="comparison-panel"><div className="comparison-header"><div><p className="eyebrow">Side by side</p><h2 id="comparison-title">Compare residences</h2></div><button type="button" onClick={() => setComparisonOpen(false)} aria-label="Close comparison">×</button></div><div className={`comparison-table comparison-${compared.length}`}><div className="comparison-labels"><i aria-hidden="true" /><span>Residence</span><span>Price</span><span>Location</span><span>Bedrooms</span><span>Bathrooms</span><span>Built area</span><span>Plot / terrace</span></div>{compared.map((property) => <div className="comparison-column" key={property.slug}><img src={property.image} alt="" /><strong>{property.title}</strong><span>{property.priceLabel}</span><span>{property.location}</span><span>{property.beds}</span><span>{property.baths}</span><span>{property.built.toLocaleString("en-GB")} m²</span><span>{property.plot ? `${property.plot.toLocaleString("en-GB")} m² plot` : `${property.terrace?.toLocaleString("en-GB")} m² terrace`}</span><Link href={`/properties/${property.slug}`}>View property <ArrowIcon /></Link></div>)}</div></div></div>}
    </>
  );
}

export function EnquiryForm({ propertyTitle }: { propertyTitle?: string }) {
  const [sent, setSent] = useState(false);
  if (sent) return <div className="form-success"><span>✓</span><h3>Thank you.</h3><p>One of our Marbella advisors will contact you personally within one business day.</p></div>;
  return (
    <form className="enquiry-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      {propertyTitle && <input type="hidden" name="property" value={propertyTitle} />}
      <div className="form-row"><label>First name<input required name="firstName" /></label><label>Last name<input required name="lastName" /></label></div>
      <label>Email address<input required type="email" name="email" /></label>
      <label>Phone number<input required type="tel" name="phone" placeholder="+34" /></label>
      <label>How can we help?<textarea name="message" defaultValue={propertyTitle ? `I would like more information about ${propertyTitle}.` : "I would like to discuss my property requirements."} /></label>
      <label className="consent"><input required type="checkbox" /> <span>I have read and accept the privacy policy.</span></label>
      <button className="button button-dark" type="submit">Send private enquiry <ArrowIcon /></button>
    </form>
  );
}
