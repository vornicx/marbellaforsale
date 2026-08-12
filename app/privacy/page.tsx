import type { Metadata } from "next";
import { Footer, Header } from "../components";

export const metadata: Metadata = { title: "Privacy & Legal" };

export default function PrivacyPage() {
  return <><Header /><main><section className="page-hero"><div className="shell"><p className="eyebrow">Legal information</p><h1>Privacy,<br /><em>with clarity.</em></h1><p>How Marbella For Sale S.L. handles personal information and website enquiries.</p></div></section><section className="section shell area-copy"><div><p className="eyebrow">Last updated</p><p className="lead">12 August 2026</p></div><div className="body-copy"><h2 style={{ fontSize: 38, marginBottom: 20 }}>Data controller</h2><p>Marbella For Sale S.L., Edificio Marina Banús Bl.4 Local 8, Calle Francisco Villalón, 29660 Puerto Banús. Contact: info@marbellaforsale.com.</p><h2 style={{ fontSize: 38, margin: "42px 0 20px" }}>Information we use</h2><p>When you make an enquiry, we use the details you provide to respond, understand your property requirements and deliver the service you request. Marketing communications are sent only where a valid legal basis exists, and you may opt out at any time.</p><h2 style={{ fontSize: 38, margin: "42px 0 20px" }}>Your choices</h2><p>You may request access, correction, deletion, restriction or portability of your personal information, and object to certain processing, by contacting us. Essential cookies support site operation; analytics and marketing cookies require consent where applicable.</p></div></section></main><Footer /></>;
}
