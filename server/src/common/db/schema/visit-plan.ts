import { boolean, date, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { segmentEnum } from './entity';

export const visitPlans = pgTable('visit_plans', {
	id: uuid('id').primaryKey().defaultRandom(),
	entityId: varchar('entity_id').notNull(),
	entityName: varchar('entity_name', { length: 100 }).notNull(),
	entityType: varchar('entity_type', { length: 50 }).notNull(),
	segment: segmentEnum('segment').notNull(),
	entityRegion: varchar('entity_region', { length: 50 }).notNull(),
	visitDate: date('visit_date').notNull(),
	salesId: varchar('sales_id'),
	salesName: varchar('sales_name'),
	status: boolean('status').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type VisitPlan = typeof visitPlans.$inferSelect;
export type NewVisitPlan = typeof visitPlans.$inferInsert;
