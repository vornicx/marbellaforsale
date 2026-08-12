declare module "cloudflare:workers" {
  import type { AnyD1Database } from "drizzle-orm/d1/driver";

  export const env: {
    DB?: AnyD1Database;
  };
}
