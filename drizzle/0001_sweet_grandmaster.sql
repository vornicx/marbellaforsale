ALTER TABLE `enquiries` ADD `internal_notes` text;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `next_action_at` integer;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `viewing_at` integer;--> statement-breakpoint
CREATE INDEX `enquiries_next_action_idx` ON `enquiries` (`next_action_at`);