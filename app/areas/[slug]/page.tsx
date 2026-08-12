import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon, Footer, Header, PropertyCard } from "../../components";
import { areas } from "../../data";
import { getManagedProperties } from "../../property-store";

export const dynamic = "force-dynamic";

export function generateStaticParams() { return areas.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const area = areas.find((item) => item.slug === slug); return area ? { title: `Property for Sale in ${area.name}`, description: `${area.copy} Explore luxury property for sale in ${area.name}, Marbella.` } : {}; }

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const area = areas.find((item) => item.slug === slug); if (!area) notFound(); const properties = await getManagedProperties();
  const matched = properties.filter((property) => property.area.toLowerCase().replaceAll(" ", "-").includes(slug.split("-")[0]) || property.location.includes(area.name.replace("The ", ""))).slice(0, 3);
  return <><Header /><main><section className="area-hero"><img src={area.image} alt={`${area.name}, Marbella`} /><div className="shell"><p className="eyebrow light">Marbella area guide</p><h1>{area.name}</h1></div></section><section className="area-copy section shell"><div><p className="eyebrow">The character</p><p className="lead">{area.tagline}. A place chosen as much for the life around it as the homes within it.</p></div><div className="body-copy"><p>{area.copy}</p><p>Our team works across both publicly listed and discreet private opportunities in this area. We can compare individual streets, communities and future developments against your priorities, then arrange a focused itinerary.</p><Link className="text-link" href="/contact">Request a tailored area brief <ArrowIcon /></Link></div></section>{matched.length > 0 && <section className="section shell" style={{ paddingTop: 10 }}><div className="section-heading split-heading"><div><p className="eyebrow">Selected in {area.name}</p><h2>Properties to consider</h2></div><Link className="outline-link" href="/properties">Search all properties <ArrowIcon /></Link></div><div className="property-grid">{matched.map((property) => <PropertyCard property={property} key={property.slug} />)}</div></section>}</main><Footer /></>;
}
