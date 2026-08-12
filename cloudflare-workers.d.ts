declare module "cloudflare:workers" {
  import type { AnyD1Database } from "drizzle-orm/d1/driver";

  type StoredObject = {
    body: ReadableStream<Uint8Array>;
    httpEtag: string;
    writeHttpMetadata(headers: Headers): void;
  };

  type ObjectBucket = {
    get(key: string): Promise<StoredObject | null>;
    put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }): Promise<unknown>;
  };

  export const env: {
    DB?: AnyD1Database;
    BUCKET?: ObjectBucket;
  };
}
