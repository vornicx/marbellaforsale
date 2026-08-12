import type { Metadata } from "next";
import { EnquiryForm, Footer, Header } from "../components";
import { imageSet } from "../data";

export const metadata: Metadata = { title: "Sell Your Property in Marbella", description: "Private valuation, exceptional marketing and qualified international reach for property owners in Marbella and the Costa del Sol." };

export default function SellPage() {
  const steps = [
    ["01", "Private appraisal", "A considered valuation based on the property, comparable evidence, current demand and your objectives."],
    ["02", "Editorial presentation", "Art direction, photography, film, copy and a campaign designed around the character of your home."],
    ["03", "Qualified exposure", "Precision marketing to our international buyer network and the right public or discreet channels."],
    ["04", "Personal representation", "Thoughtful viewings, useful feedback, strong negotiation and complete support through completion."],
  ];
  return <><Header /><main><section className="full-bleed-banner" style={{ backgroundImage: `url(${imageSet.interior})` }}><div className="shell"><p className="eyebrow light">Sell with Marbella For Sale</p><h1>Your property.<br /><em>Properly represented.</em></h1></div></section><section className="area-copy section shell"><div><p className="eyebrow">Our responsibility</p><p className="lead">A remarkable home should never feel like just another listing.</p></div><div className="body-copy"><p>We position every property with judgement: the right price, the right narrative and the right audience. You receive clear reporting, direct access to your advisor and a strategy that evolves with real market response.</p></div></section><section className="section" style={{ background: "var(--cream)" }}><div className="shell"><div className="section-heading"><p className="eyebrow">The sales experience</p><h2>Considered at every stage</h2></div><div className="editorial-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>{steps.map(([index, title, copy]) => <article className="editorial-card" key={index}><span className="index">{index}</span><h2>{title}</h2><p>{copy}</p></article>)}</div></div></section><section className="property-enquiry section shell"><div className="enquiry-intro"><p className="eyebrow">Confidential valuation</p><h2>Begin with<br /><em>a conversation.</em></h2><p>Share a few details about your property. Your information remains private and an experienced advisor will contact you personally.</p></div><EnquiryForm source="valuation" /></section></main><Footer /></>;
}
