import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon, EnquiryForm, Footer, Header, PropertyCard } from "../../components";
import { properties } from "../../data";

export function generateStaticParams() { return properties.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const property = properties.find((item) => item.slug === slug);
  if (!property) return {};
  return { title: `${property.title} — ${property.location}`, description: `${property.priceLabel}. ${property.beds} bedrooms, ${property.baths} bathrooms and ${property.built} m² in ${property.location}. ${property.description}` };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const property = properties.find((item) => item.slug === slug);
  if (!property) notFound();
  const related = properties.filter((item) => item.slug !== property.slug && (item.area === property.area || item.type === property.type)).slice(0, 3);
  const schema = { "@context": "https://schema.org", "@type": "RealEstateListing", name: property.title, description: property.description, url: `https://www.marbellaforsale.com/properties/${property.slug}`, image: property.gallery, offers: { "@type": "Offer", priceCurrency: "EUR", price: property.price, availability: "https://schema.org/InStock" }, address: { "@type": "PostalAddress", addressLocality: property.location, addressRegion: "Málaga", addressCountry: "ES" } };
  return <><Header /><main>
    <section className="detail-hero"><img src={property.image} alt={`${property.title} in ${property.location}`} /><div className="detail-title shell"><span className="location">{property.location} · {property.ref}</span><h1>{property.title}</h1><div className="detail-bottom"><span className="detail-price">{property.priceLabel}</span><div className="detail-specs"><span>{property.beds} bedrooms</span><span>{property.baths} bathrooms</span><span>{property.built.toLocaleString("en-GB")} m² built</span>{property.plot && <span>{property.plot.toLocaleString("en-GB")} m² plot</span>}</div></div></div></section>
    <section className="detail-overview section shell"><div><p className="eyebrow">The residence</p><h2>Space, light<br />and <em>complete privacy.</em></h2></div><div className="detail-description"><p>{property.description}</p><div className="feature-grid">{property.features.map((feature) => <span key={feature}>— &nbsp; {feature}</span>)}</div><Link className="text-link" href="#enquire" style={{ marginTop: 38 }}>Request full details <ArrowIcon /></Link></div></section>
    <section className="gallery" aria-label="Property gallery">{property.gallery.slice(0, 3).map((image, index) => <figure key={image}><img src={image} alt={`${property.title} view ${index + 1}`} loading="lazy" /></figure>)}</section>
    <section className="property-enquiry section shell" id="enquire"><div className="enquiry-intro"><p className="eyebrow">Private viewing</p><h2>Experience it<br /><em>for yourself.</em></h2><p>Arrange a private viewing or request the complete brochure, floor plans and location details. Every enquiry is handled personally and with discretion.</p></div><EnquiryForm propertyTitle={property.title} /></section>
    {related.length > 0 && <section className="section shell" style={{ paddingTop: 20 }}><div className="section-heading split-heading"><div><p className="eyebrow">You may also like</p><h2>Similar residences</h2></div><Link className="outline-link" href="/properties">View full collection <ArrowIcon /></Link></div><div className="property-grid">{related.map((item) => <PropertyCard property={item} key={item.slug} />)}</div></section>}
  </main><Footer /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></>;
}
