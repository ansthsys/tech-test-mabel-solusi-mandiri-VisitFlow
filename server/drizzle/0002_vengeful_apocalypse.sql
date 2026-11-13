ALTER TABLE "visit_plans" RENAME COLUMN "entity_segment" TO "segment";--> statement-breakpoint
ALTER TABLE "visit_plans" ALTER COLUMN "status" SET NOT NULL;