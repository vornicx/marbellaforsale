import type { Metadata } from "next";
import { Footer, Header, PropertyResults } from "../components";
import { getManagedProperties } from "../property-store";

export const metadata: Metadata = {
  title: "Luxury Properties for Sale in Marbella",
  description: "Explore a considered collection of villas, penthouses and apartments for sale in Marbella, Puerto Banús, Benahavís and the Costa del Sol.",
};

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const properties = await getManagedProperties();
  const params = await searchParams;
  const value = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
  return <><Header /><main><section className="page-hero"><div className="shell"><p className="eyebrow">Property search</p><h1>Find a place<br /><em>that feels like yours.</em></h1><p>From beachfront penthouses to private hillside estates, explore our curated collection — or ask us to search the entire market for you.</p></div></section><section className="catalog shell"><PropertyResults properties={properties} initialFilters={{ area: value("area"), type: value("type"), min: value("min"), max: value("max"), beds: value("beds"), saved: value("saved") === "true" }} /></section></main><Footer /></>;
}
