import type { Metadata } from "next";
import { Footer, Header, PropertyResults } from "../components";
import { properties } from "../data";

export const metadata: Metadata = {
  title: "Luxury Properties for Sale in Marbella",
  description: "Explore a considered collection of villas, penthouses and apartments for sale in Marbella, Puerto Banús, Benahavís and the Costa del Sol.",
};

export default function PropertiesPage() {
  return <><Header /><main><section className="page-hero"><div className="shell"><p className="eyebrow">Property search</p><h1>Find a place<br /><em>that feels like yours.</em></h1><p>From beachfront penthouses to private hillside estates, explore our curated collection — or ask us to search the entire market for you.</p></div></section><section className="catalog shell"><PropertyResults properties={properties} /></section></main><Footer /></>;
}
