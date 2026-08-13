import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, Footer, Header, PropertyCard } from "../components";
import { imageSet } from "../data";
import { getManagedProperties } from "../property-store";

export const revalidate = 300;

export const metadata: Metadata = { title: "New Developments in Marbella", description: "Explore carefully selected new-build and off-plan villas, apartments and penthouses across Marbella and the Costa del Sol." };

export default async function DevelopmentsPage() {
  const properties = await getManagedProperties();
  return <><Header /><main><section className="full-bleed-banner" style={{ backgroundImage: `url(${imageSet.dusk})` }}><div className="shell"><p className="eyebrow light">New developments · Costa del Sol</p><h1>Tomorrow&apos;s most<br /><em>desirable addresses.</em></h1></div></section><section className="area-copy section shell"><div><p className="eyebrow">Off-plan, without uncertainty</p><p className="lead">Independent guidance on the developments, developers and locations worth your attention.</p></div><div className="body-copy"><p>Buying new requires more than choosing a floor plan. We compare build quality, licences, payment schedules, orientation, future supply and realistic resale potential — then stay alongside you through completion.</p><Link className="text-link" href="/contact">Request the development shortlist <ArrowIcon /></Link></div></section><section className="section shell" style={{ paddingTop: 10 }}><div className="section-heading split-heading"><div><p className="eyebrow">Selected new homes</p><h2>Current opportunities</h2></div><Link className="outline-link" href="/contact">Receive the full portfolio <ArrowIcon /></Link></div><div className="property-grid">{properties.slice(0, 6).map((property) => <PropertyCard property={property} key={property.slug} />)}</div></section></main><Footer /></>;
}
