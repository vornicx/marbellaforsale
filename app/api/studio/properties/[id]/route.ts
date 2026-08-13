import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "../../../../../db";
import { propertyRecords } from "../../../../../db/schema";
import { getChatGPTUser } from "../../../../chatgpt-auth";

export const dynamic = "force-dynamic";

const allowedTypes = new Set(["Villa", "Penthouse", "Apartment", "Townhouse"]);
const allowedStatuses = new Set(["published", "draft", "archived"]);

function textValue(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function optionalNumber(value: unknown) {
  if (value === null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

function stringList(value: unknown, maxItems: number, maxLength: number) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim().slice(0, maxLength)).filter(Boolean).slice(0, maxItems) : [];
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { id } = await params;
  const body = await request.json() as Record<string, unknown>;
  const slug = textValue(body.slug || id, 180).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const title = textValue(body.title, 180);
  const location = textValue(body.location, 180);
  const area = textValue(body.area, 100);
  const type = textValue(body.type, 40);
  const ref = textValue(body.ref, 40).toUpperCase();
  const description = textValue(body.description, 4000);
  const image = textValue(body.image, 1000);
  const badge = textValue(body.badge, 80) || null;
  const status = textValue(body.status, 30);
  const price = optionalNumber(body.price);
  const beds = optionalNumber(body.beds);
  const baths = optionalNumber(body.baths);
  const built = optionalNumber(body.built);
  const plot = optionalNumber(body.plot);
  const terrace = optionalNumber(body.terrace);
  const gallery = stringList(body.gallery, 30, 1000);
  const features = stringList(body.features, 30, 160);

  if (!slug || !title || !location || !area || !ref || !description || !image || !allowedTypes.has(type) || !allowedStatuses.has(status)) {
    return NextResponse.json({ error: "Complete the required property details." }, { status: 400 });
  }
  if ([price, beds, baths, built].some((value) => value === null || value === undefined) || plot === undefined || terrace === undefined) {
    return NextResponse.json({ error: "Check the property measurements and price." }, { status: 400 });
  }

  const now = new Date();
  const values = {
    id: slug,
    slug,
    title,
    location,
    area,
    type,
    price: Math.round(price as number),
    beds: Math.round(beds as number),
    baths: baths as number,
    built: Math.round(built as number),
    plot: plot === null ? null : Math.round(plot),
    terrace: terrace === null ? null : Math.round(terrace),
    image,
    galleryJson: JSON.stringify(gallery.length ? gallery : [image]),
    badge,
    ref,
    description,
    featuresJson: JSON.stringify(features),
    status,
    featured: body.featured === true,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const db = await getDb();
    await db.insert(propertyRecords).values(values).onConflictDoUpdate({
      target: propertyRecords.slug,
      set: { ...values, createdAt: undefined },
    });
    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath("/developments");
    revalidatePath("/areas/[slug]", "page");
    revalidatePath(`/properties/${slug}`);
    return NextResponse.json({ ok: true, property: { ...values, createdAt: values.createdAt.toISOString(), updatedAt: values.updatedAt.toISOString() } });
  } catch (error) {
    console.error("Unable to save property", error);
    return NextResponse.json({ error: "The property could not be saved." }, { status: 500 });
  }
}
