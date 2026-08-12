CREATE TABLE `property_records` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`location` text NOT NULL,
	`area` text NOT NULL,
	`type` text NOT NULL,
	`price` integer NOT NULL,
	`beds` integer NOT NULL,
	`baths` real NOT NULL,
	`built` integer NOT NULL,
	`plot` integer,
	`terrace` integer,
	`image` text NOT NULL,
	`gallery_json` text NOT NULL,
	`badge` text,
	`ref` text NOT NULL,
	`description` text NOT NULL,
	`features_json` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`featured` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `property_records_slug_idx` ON `property_records` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `property_records_ref_idx` ON `property_records` (`ref`);--> statement-breakpoint
CREATE INDEX `property_records_status_idx` ON `property_records` (`status`);--> statement-breakpoint
CREATE INDEX `property_records_updated_at_idx` ON `property_records` (`updated_at`);