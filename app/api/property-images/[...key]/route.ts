import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const { env } = await import("cloudflare:workers");
  if (!env.BUCKET) return NextResponse.json({ error: "Image storage is unavailable." }, { status: 503 });
  const object = await env.BUCKET.get(key.join("/"));
  if (!object) return NextResponse.json({ error: "Image not found." }, { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}
