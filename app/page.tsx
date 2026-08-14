import Link from "next/link";
import { Header, Footer, PropertyCard, ArrowIcon, SearchPanel, LuxuryMotion } from "./components";
import { areas, imageSet } from "./data";
import { getManagedProperties } from "./property-store";

export const revalidate = 300;

export default async function Home() {
  const properties = await getManagedProperties();
  const propertyCount = properties.length;
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Marbella For Sale",
    url: "https://marbellaforsale.com/",
    telephone: "+34 952 907 386",
    email: "info@marbellaforsale.com",
    description: "Luxury property advisory and curated homes for sale across Marbella and the Costa del Sol.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Edificio Marina Banús Bl.4 Local 8, Calle Francisco Villalón",
      postalCode: "29660",
      addressLocality: "Puerto Banús",
      addressRegion: "Málaga",
      addressCountry: "ES",
    },
    areaServed: ["Marbella", "Benahavís", "Estepona", "Costa del Sol"],
  };

  return (
    <>
      <Header transparent morphLogo />
      <main>
        <LuxuryMotion />

        <section className="hero">
          <picture className="hero-media">
            <source srcSet="/images/editorial/hero-villa.webp" type="image/webp" />
            <img src="/images/editorial/hero-villa.webp" alt="Luxury villa in Marbella at dusk" width="1200" height="900" fetchPriority="high" decoding="async" />
          </picture>
          <div className="hero-shade" />

          <div className="hero-content shell">
            <p className="eyebrow light">Independent property advisory · Puerto Banús</p>
            <h1>Marbella,<br /><em>chosen well.</em></h1>
            <div className="hero-copyline">
              <p>Curated homes, new developments and a buyer-led search across Marbella and the Costa del Sol.</p>
              <div className="hero-actions">
                <Link className="hero-primary" href="/properties">Explore homes <ArrowIcon /></Link>
                <Link className="hero-secondary" href="/contact">Private search</Link>
              </div>
            </div>
          </div>

          <div className="hero-search shell"><SearchPanel /></div>
          <div className="scroll-cue"><span>Discover</span><i /></div>
        </section>

        <section className="featured featured-first section shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">A curated first look</p>
              <h2>Exceptional homes</h2>
              <p className="selection-note">A focused selection across Marbella, Benahavís and the Costa del Sol, with direct access to the full property search.</p>
            </div>
            <div className="heading-action">
              <span>{propertyCount} current {propertyCount === 1 ? "residence" : "residences"}</span>
              <Link className="outline-link" href="/properties">View all properties <ArrowIcon /></Link>
            </div>
          </div>
          <div className="property-grid">
            {properties.slice(0, 3).map((property, index) => <PropertyCard property={property} key={property.slug} priority={index === 0} />)}
          </div>
        </section>

        <section className="advisory-proof shell" aria-label="Marbella For Sale advisory strengths">
          <article><span>01</span><strong>Puerto Banús office</strong><p>A direct local base in the market you are buying into.</p></article>
          <article><span>02</span><strong>Buyer-led search</strong><p>Open-market discovery and discreet opportunities shaped around your brief.</p></article>
          <article><span>03</span><strong>One point of contact</strong><p>Personal guidance from first shortlist through viewing and completion.</p></article>
        </section>

        <section className="intro-story section shell">
          <div className="intro-portrait">
            <img src="/images/editorial/not-simply-property.webp" alt="Contemporary luxury residence overlooking the Mediterranean" width="1920" height="1280" loading="lazy" decoding="async" />
            <span>Marbella · Costa del Sol</span>
          </div>
          <div className="intro-editorial">
            <div className="section-index"><span>01</span><i /></div>
            <div className="intro-title"><p className="eyebrow">A considered collection</p><h2>Not simply a property.<br /><em>A place that belongs to you.</em></h2></div>
            <div className="intro-action"><span>Independent advice<br />Local perspective</span><Link className="text-link" href="/about">Our approach <ArrowIcon /></Link></div>
          </div>
        </section>

        <section className="signature-section">
          <div className="signature-image">
            <img src="/images/editorial/private-search.webp" alt="Private luxury residence in Marbella" width="1920" height="1440" loading="lazy" decoding="async" />
            <span>Private opportunities · Marbella</span>
          </div>
          <div className="signature-card">
            <p className="eyebrow light">Private search</p>
            <h2>The right property<br />may never reach<br /><em>the open market.</em></h2>
            <div className="signature-points"><span>Entire market access</span><span>Discreet opportunities</span><span>One dedicated advisor</span></div>
            <Link className="button button-light" href="/contact">Begin a private search <ArrowIcon /></Link>
          </div>
        </section>

        <section className="areas-showcase section shell">
          <div className="section-heading split-heading"><div><p className="eyebrow">The places to know</p><h2>Discover Marbella</h2></div><Link className="outline-link" href="/areas">Explore every area <ArrowIcon /></Link></div>
          <div className="area-mosaic">
            {areas.slice(0, 4).map((area, index) => (
              <Link href={`/areas/${area.slug}`} className={`area-tile-home area-tile-${index + 1}`} key={area.slug}>
                <img src={area.image} alt={`${area.name}, Marbella`} loading="lazy" decoding="async" />
                <span className="area-tile-shade" />
                <span className="area-number">0{index + 1}</span>
                <span className="area-tile-copy"><small>{area.tagline}</small><strong>{area.name}</strong></span>
                <span className="circle-arrow"><ArrowIcon /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="market-section">
          <div className="market-image"><img src={imageSet.coast} alt="Mediterranean coastline in Marbella" loading="lazy" decoding="async" /><span>Marbella · Mediterranean coast</span></div>
          <div className="market-panel">
            <p className="eyebrow light">Market intelligence · 2026</p>
            <h2>Informed decisions.<br /><em>Made with confidence.</em></h2>
            <div className="market-stats"><div><strong>20+</strong><span>Years of local market knowledge</span></div><div><strong>10</strong><span>Prime Costa del Sol areas covered</span></div><div><strong>360°</strong><span>Support from search to completion</span></div></div>
            <Link className="text-link" href="/guides">Explore our buyer&apos;s guides <ArrowIcon /></Link>
          </div>
        </section>

        <section className="seller-story">
          <div className="seller-visual"><img src="/images/properties/r5395735/03.webp" alt="Beachside villa represented by Marbella For Sale" width="1600" height="1067" loading="lazy" decoding="async" /><span>For property owners · Marbella</span></div>
          <div className="seller-copy"><p className="eyebrow">Sell with Marbella For Sale</p><h2>Your home deserves<br /><em>the right audience.</em></h2><div className="seller-services"><span>Premium presentation</span><span>Qualified international reach</span><span>Personal sales strategy</span></div><Link className="button button-dark" href="/sell">Request a private valuation <ArrowIcon /></Link></div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
