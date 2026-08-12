import { NextResponse } from "next/server";
import { getChatGPTUser } from "../../../chatgpt-auth";

export const dynamic = "force-dynamic";

const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !extensions[file.type] || file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ error: "Use a JPG, PNG, WebP or AVIF image up to 12 MB." }, { status: 400 });
  }

  const { env } = await import("cloudflare:workers");
  if (!env.BUCKET) return NextResponse.json({ error: "Image storage is unavailable." }, { status: 503 });
  const key = `property-images/${crypto.randomUUID()}.${extensions[file.type]}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" } });
  return NextResponse.json({ ok: true, url: `/api/property-images/${key}` }, { status: 201 });
}
