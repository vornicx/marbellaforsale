import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, Footer, Header } from "../components";
import { imageSet } from "../data";

export const metadata: Metadata = {
  title: "About Marbella For Sale",
  description: "Meet Marbella For Sale, an independent real estate company based in Puerto Banús and founded by Nicolas de Zutter.",
};

export default function AboutPage() {
  return <><Header /><main>
    <section className="page-hero"><div className="shell"><p className="eyebrow">Marbella For Sale</p><h1>Local knowledge.<br /><em>International perspective.</em></h1><p>Independent real estate advice from Puerto Banús, built around a simple idea: understand the client before recommending the property.</p></div></section>
    <section className="gallery" style={{ gridTemplateColumns: "1fr", gridTemplateRows: "680px", padding: 0 }}><figure style={{ gridArea: "auto" }}><img src={imageSet.marina} alt="Puerto Banús marina, Marbella" /></figure></section>
    <section className="area-copy section shell"><div><p className="eyebrow">Founder-led</p><p className="lead">A long-term point of view on Marbella, not a fly-in property service.</p><div className="founder-signature"><strong>Nicolas de Zutter</strong><span>Founder · Marbella For Sale</span></div></div><div className="body-copy"><p>Nicolas de Zutter founded Marbella For Sale after building his career in real estate in southern Spain. More than two decades in Spain have shaped a business centred on local knowledge, straightforward advice and long-term client relationships.</p><p>The team works across Marbella and the wider Costa del Sol, covering established homes, new developments and property searches for international buyers as well as owners preparing to sell.</p><Link className="text-link" href="/contact">Meet us in Puerto Banús <ArrowIcon /></Link></div></section>
    <section className="section" style={{ background: "var(--cream)" }}><div className="shell"><div className="section-heading"><p className="eyebrow">How we work</p><h2>Clarity before<br /><em>pressure.</em></h2></div><div className="editorial-grid"><article className="editorial-card"><span className="index">01</span><h2>Listen</h2><p>Start with the brief, the reason for buying and the details that actually change the decision.</p></article><article className="editorial-card"><span className="index">02</span><h2>Curate</h2><p>Reduce a wide market to a considered shortlist across homes, areas and new developments.</p></article><article className="editorial-card"><span className="index">03</span><h2>Guide</h2><p>Keep one clear line of communication from first conversation through viewing and completion.</p></article></div></div></section>
  </main><Footer /></>;
}
