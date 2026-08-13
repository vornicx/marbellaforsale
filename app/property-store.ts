import { cache } from "react";
import { asc, desc } from "drizzle-orm";
import { getDb } from "../db";
import { propertyRecords, type PropertyRecord } from "../db/schema";
import { properties as catalogueProperties, type Property } from "./data";

export type ManagedProperty = Property & {
  id: string;
  status: "published" | "draft" | "archived";
  featured: boolean;
  updatedAt: string;
};

const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function readList(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function optimizedAsset(value: string) {
  return value.startsWith("/images/") ? value.replace(/\.jpg$/i, ".webp") : value;
}

function fromRecord(record: PropertyRecord): ManagedProperty {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    location: record.location,
    area: record.area,
    type: record.type as Property["type"],
    price: record.price,
    priceLabel: money.format(record.price),
    beds: record.beds,
    baths: record.baths,
    built: record.built,
    plot: record.plot ?? undefined,
    terrace: record.terrace ?? undefined,
    image: optimizedAsset(record.image),
    gallery: readList(record.galleryJson).map(optimizedAsset),
    badge: record.badge ?? undefined,
    ref: record.ref,
    description: record.description,
    features: readList(record.featuresJson),
    status: record.status as ManagedProperty["status"],
    featured: record.featured,
    updatedAt: record.updatedAt.toISOString(),
  };
}

function catalogueRecord(property: Property, index: number): ManagedProperty {
  return { ...property, id: property.slug, status: "published", featured: index < 3, updatedAt: new Date(0).toISOString() };
}

export const getManagedProperties = cache(async (includeDrafts = false): Promise<ManagedProperty[]> => {
  const base = catalogueProperties.map(catalogueRecord);
  if (process.env.VERCEL === "1") return includeDrafts ? base : base.filter((property) => property.status === "published");
  try {
    const db = await getDb();
    const records = await db.select().from(propertyRecords).orderBy(desc(propertyRecords.featured), desc(propertyRecords.updatedAt), asc(propertyRecords.title));
    const overrides = new Map(records.map((record) => [record.slug, fromRecord(record)]));
    const merged = base.map((property) => overrides.get(property.slug) || property);
    const extra = records.map(fromRecord).filter((record) => !catalogueProperties.some((property) => property.slug === record.slug));
    const all = [...merged, ...extra].sort((a, b) => Number(b.featured) - Number(a.featured));
    return includeDrafts ? all : all.filter((property) => property.status === "published");
  } catch {
    return base;
  }
});

export function getPreviewProperties() {
  return catalogueProperties.map(catalogueRecord);
}
