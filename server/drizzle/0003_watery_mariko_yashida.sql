ALTER TABLE "sales" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "sales" CASCADE;--> statement-breakpoint
ALTER TABLE "visit_plans" ALTER COLUMN "sales_name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "visit_plans" DROP COLUMN "sales_id";