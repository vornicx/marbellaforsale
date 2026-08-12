import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const enquiries = sqliteTable("enquiries", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  source: text("source").notNull(),
  propertyTitle: text("property_title"),
  propertyRef: text("property_ref"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  priority: text("priority").notNull().default("normal"),
  assignedTo: text("assigned_to"),
  internalNotes: text("internal_notes"),
  nextActionAt: integer("next_action_at", { mode: "timestamp_ms" }),
  viewingAt: integer("viewing_at", { mode: "timestamp_ms" }),
}, (table) => [
  index("enquiries_created_at_idx").on(table.createdAt),
  index("enquiries_status_idx").on(table.status),
  index("enquiries_email_idx").on(table.email),
  index("enquiries_next_action_idx").on(table.nextActionAt),
]);

export type Enquiry = typeof enquiries.$inferSelect;
export type NewEnquiry = typeof enquiries.$inferInsert;

export const propertyRecords = sqliteTable("property_records", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  area: text("area").notNull(),
  type: text("type").notNull(),
  price: integer("price").notNull(),
  beds: integer("beds").notNull(),
  baths: real("baths").notNull(),
  built: integer("built").notNull(),
  plot: integer("plot"),
  terrace: integer("terrace"),
  image: text("image").notNull(),
  galleryJson: text("gallery_json").notNull(),
  badge: text("badge"),
  ref: text("ref").notNull(),
  description: text("description").notNull(),
  featuresJson: text("features_json").notNull(),
  status: text("status").notNull().default("draft"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
}, (table) => [
  uniqueIndex("property_records_slug_idx").on(table.slug),
  uniqueIndex("property_records_ref_idx").on(table.ref),
  index("property_records_status_idx").on(table.status),
  index("property_records_updated_at_idx").on(table.updatedAt),
]);

export type PropertyRecord = typeof propertyRecords.$inferSelect;
export type NewPropertyRecord = typeof propertyRecords.$inferInsert;
