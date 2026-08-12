import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, Footer, Header } from "../components";

export const metadata: Metadata = { title: "Marbella Property Buyer’s Guides", description: "Clear guidance on buying property in Marbella: purchase costs, legal process, areas, new developments and international ownership." };

const guides = [
  ["01", "The buying process", "From reservation and due diligence to notary and completion — the complete sequence, explained clearly."],
  ["02", "Purchase costs", "A practical overview of transfer tax or VAT, legal fees, notary costs and the budget beyond the purchase price."],
  ["03", "Choosing an area", "How Marbella’s key neighbourhoods differ in setting, property type, year-round life and long-term value."],
  ["04", "Buying off-plan", "Licences, bank guarantees, stage payments, snagging and the questions every new-build buyer should ask."],
  ["05", "Non-resident ownership", "The essentials for international buyers: NIE, banking, finance, annual costs and professional representation."],
  ["06", "Selling in Marbella", "Valuation, presentation, documentation, taxation and what a well-managed sales process should look like."],
];

export default function GuidesPage() {
  return <><Header /><main><section className="page-hero"><div className="shell"><p className="eyebrow">Knowledge, made useful</p><h1>A clearer route<br /><em>to Marbella.</em></h1><p>Concise, locally informed guidance for buyers and owners — without jargon, pressure or unnecessary complexity.</p></div></section><section className="section shell editorial-grid">{guides.map(([index, title, copy]) => <article className="editorial-card" key={index}><span className="index">Guide {index}</span><h2>{title}</h2><p>{copy}</p><Link className="text-link" href="/contact">Ask an advisor <ArrowIcon /></Link></article>)}</section><section className="market-section section"><div className="market-inner shell"><div className="market-copy"><p className="eyebrow">A question specific to you?</p><h2>Good advice begins<br /><em>with context.</em></h2><p>Tell us what you are considering and we will connect you with the right local advisor.</p><Link className="button button-dark" href="/contact">Speak to our team <ArrowIcon /></Link></div><div className="market-stats"><div><strong>1:1</strong><span>Personal buyer consultation</span></div><div><strong>EN</strong><span>International client support</span></div><div><strong>360°</strong><span>Search, legal and completion guidance</span></div></div></div></section></main><Footer /></>;
}
