import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

type D1DatabaseLike = {
  prepare(query: string): { run(): Promise<unknown> };
  batch(statements: Array<unknown>): Promise<unknown>;
};

let databaseReady: Promise<void> | null = null;

async function ensureDatabase(d1: D1DatabaseLike) {
  if (!databaseReady) {
    databaseReady = d1.batch([
      d1.prepare(`CREATE TABLE IF NOT EXISTS enquiries (
        id text PRIMARY KEY NOT NULL,
        created_at integer NOT NULL,
        updated_at integer NOT NULL,
        source text NOT NULL,
        property_title text,
        property_ref text,
        first_name text NOT NULL,
        last_name text NOT NULL,
        email text NOT NULL,
        phone text NOT NULL,
        message text NOT NULL,
        status text DEFAULT 'new' NOT NULL,
        priority text DEFAULT 'normal' NOT NULL,
        assigned_to text,
        internal_notes text,
        next_action_at integer,
        viewing_at integer
      )`),
      d1.prepare("CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at)"),
      d1.prepare("CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries (status)"),
      d1.prepare("CREATE INDEX IF NOT EXISTS enquiries_email_idx ON enquiries (email)"),
      d1.prepare("CREATE INDEX IF NOT EXISTS enquiries_next_action_idx ON enquiries (next_action_at)"),
      d1.prepare(`CREATE TABLE IF NOT EXISTS property_records (
        id text PRIMARY KEY NOT NULL,
        created_at integer NOT NULL,
        updated_at integer NOT NULL,
        slug text NOT NULL,
        title text NOT NULL,
        location text NOT NULL,
        area text NOT NULL,
        type text NOT NULL,
        price integer NOT NULL,
        beds integer NOT NULL,
        baths real NOT NULL,
        built integer NOT NULL,
        plot integer,
        terrace integer,
        image text NOT NULL,
        gallery_json text NOT NULL,
        badge text,
        ref text NOT NULL,
        description text NOT NULL,
        features_json text NOT NULL,
        status text DEFAULT 'draft' NOT NULL,
        featured integer DEFAULT false NOT NULL
      )`),
      d1.prepare("CREATE UNIQUE INDEX IF NOT EXISTS property_records_slug_idx ON property_records (slug)"),
      d1.prepare("CREATE UNIQUE INDEX IF NOT EXISTS property_records_ref_idx ON property_records (ref)"),
      d1.prepare("CREATE INDEX IF NOT EXISTS property_records_status_idx ON property_records (status)"),
      d1.prepare("CREATE INDEX IF NOT EXISTS property_records_updated_at_idx ON property_records (updated_at)"),
    ]).then(() => undefined).catch((error) => {
      databaseReady = null;
      throw error;
    });
  }
  await databaseReady;
}

export async function getDb() {
  const { env } = await import("cloudflare:workers");
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  await ensureDatabase(env.DB as unknown as D1DatabaseLike);

  return drizzle(env.DB, { schema });
}
