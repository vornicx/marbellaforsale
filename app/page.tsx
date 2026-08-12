import Link from "next/link";
import { Header, Footer, PropertyCard, ArrowIcon, SearchPanel } from "./components";
import { areas, properties } from "./data";

export default function Home() {
  const schema = {
    "@context": "https://schema.org", "@type": "RealEstateAgent", name: "Marbella For Sale",
    url: "https://www.marbellaforsale.com/", telephone: "+34 952 907 386", email: "info@marbellaforsale.com",
    address: { "@type": "PostalAddress", streetAddress: "Edificio Marina Banús Bl.4 Local 8, Calle Francisco Villalón", postalCode: "29660", addressLocality: "Puerto Banús", addressRegion: "Málaga", addressCountry: "ES" },
    areaServed: ["Marbella", "Benahavís", "Estepona", "Costa del Sol"],
  };
  return (
    <>
      <Header transparent />
      <main>
        <section className="hero">
          <div className="hero-media" aria-hidden="true" /><div className="hero-shade" />
          <div className="hero-content shell"><p className="eyebrow light">Marbella · Costa del Sol</p><h1>Where exceptional<br />living begins.</h1><p className="hero-copy">Privileged access to Marbella&apos;s most remarkable residences,<br className="desktop-only" /> selected with local knowledge and absolute discretion.</p></div>
          <div className="hero-search shell"><SearchPanel /></div><div className="scroll-cue"><span>Discover</span><i /></div>
        </section>

        <section className="intro section shell">
          <div className="section-index">01</div>
          <div className="intro-title"><p className="eyebrow">A considered collection</p><h2>Not simply a property.<br /><em>A place that belongs to you.</em></h2></div>
          <div className="intro-copy"><p>We bring clarity, judgement and a distinctly personal service to one of Europe&apos;s most desirable property markets.</p><Link className="text-link" href="/about">Our approach <ArrowIcon /></Link></div>
        </section>

        <section className="featured section shell">
          <div className="section-heading split-heading"><div><p className="eyebrow">Our private selection</p><h2>Exceptional homes</h2></div><Link className="outline-link" href="/properties">View all properties <ArrowIcon /></Link></div>
          <div className="property-grid">{properties.slice(0, 3).map((property, index) => <PropertyCard property={property} key={property.slug} priority={index === 0} />)}</div>
        </section>

        <section className="signature-section">
          <div className="signature-image" /><div className="signature-card"><p className="eyebrow light">Private search</p><h2>The right property<br />may never reach<br /><em>the open market.</em></h2><p>Tell us what you are looking for. Our advisors search the entire Costa del Sol market, including discreet off-market opportunities.</p><Link className="button button-light" href="/contact">Begin a private search <ArrowIcon /></Link></div>
        </section>

        <section className="areas section shell">
          <div className="section-heading split-heading"><div><p className="eyebrow">The places to know</p><h2>Discover Marbella</h2></div><p className="heading-note">From beachfront addresses to private hillside estates, each neighbourhood has its own rhythm.</p></div>
          <div className="area-list">{areas.slice(0, 4).map((area, index) => <Link href={`/areas/${area.slug}`} className="area-row" key={area.slug}><span className="area-number">0{index + 1}</span><span className="area-name">{area.name}</span><span className="area-note">{area.tagline}</span><span className="circle-arrow"><ArrowIcon /></span></Link>)}</div>
        </section>

        <section className="market-section section"><div className="market-inner shell"><div className="market-copy"><p className="eyebrow">Market intelligence · 2026</p><h2>Informed decisions.<br /><em>Made with confidence.</em></h2><p>Local insight, pricing context and a clear view of every step — from the first conversation to the keys in your hand.</p><Link className="text-link" href="/guides">Explore our buyer&apos;s guides <ArrowIcon /></Link></div><div className="market-stats"><div><strong>20+</strong><span>Years of local market knowledge</span></div><div><strong>10</strong><span>Prime Costa del Sol areas covered</span></div><div><strong>360°</strong><span>Support from search to completion</span></div></div></div></section>

        <section className="seller section shell"><div className="seller-visual" /><div className="seller-copy"><p className="eyebrow">For property owners</p><h2>Your home deserves<br /><em>the right audience.</em></h2><p>Premium presentation, qualified international reach and a sales strategy shaped around your property — never a one-size-fits-all listing.</p><Link className="button button-dark" href="/sell">Request a private valuation <ArrowIcon /></Link></div></section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
