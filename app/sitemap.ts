import type { MetadataRoute } from "next";
import { areas } from "./data";
import { getManagedProperties } from "./property-store";

const base = "https://marbellaforsale.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getManagedProperties();
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/properties`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${base}/developments`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/areas`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/sell`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
  ];

  const propertyPages: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${base}/properties/${property.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const areaPages: MetadataRoute.Sitemap = areas.map((area) => ({
    url: `${base}/areas/${area.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.78,
  }));

  return [...core, ...propertyPages, ...areaPages];
}
