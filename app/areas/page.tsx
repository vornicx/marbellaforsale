import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components";
import { areas } from "../data";

export const metadata: Metadata = { title: "Marbella Area Guides", description: "Discover the Golden Mile, Nueva Andalucía, Puerto Banús, Benahavís and Sierra Blanca with our local Marbella property guides." };

export default function AreasPage() {
  return <><Header /><main><section className="page-hero"><div className="shell"><p className="eyebrow">Area guides</p><h1>One coastline.<br /><em>Many ways to live.</em></h1><p>Each part of Marbella has its own atmosphere, architecture and pace. Our local guides help you find the setting that fits.</p></div></section><section className="section shell area-tiles">{areas.map((area) => <Link className="area-tile" href={`/areas/${area.slug}`} key={area.slug}><img src={area.image} alt={area.name} /><div className="area-tile-content"><h2>{area.name}</h2><p>{area.tagline}</p></div></Link>)}</section></main><Footer /></>;
}
