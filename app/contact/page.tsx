import type { Metadata } from "next";
import { EnquiryForm, Footer, Header } from "../components";

export const metadata: Metadata = { title: "Contact Marbella For Sale", description: "Speak with a Marbella real estate advisor or visit our Puerto Banús office. +34 952 907 386." };

export default function ContactPage() {
  return <><Header /><main><section className="page-hero"><div className="shell"><p className="eyebrow">Private enquiries</p><h1>How can we<br /><em>help you move?</em></h1><p>Buying, selling or simply beginning to understand the market — speak directly with a local Marbella advisor.</p></div></section><section className="property-enquiry section shell"><div className="enquiry-intro"><p className="eyebrow">Puerto Banús office</p><h2>Let&apos;s begin<br /><em>properly.</em></h2><p>Edificio Marina Banús, Bl. 4 Local 8<br />Calle Francisco Villalón<br />29660 Puerto Banús, Marbella</p><p><a href="tel:+34952907386">+34 952 907 386</a><br /><a href="mailto:info@marbellaforsale.com">info@marbellaforsale.com</a></p><p>Monday–Friday · 09:00–18:00<br />Private appointments outside these hours.</p></div><EnquiryForm /></section></main><Footer /></>;
}
