import { date, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { segmentEnum } from './entity';

export const statusEnum = pgEnum('status_enum', ['NOT_VISITED', 'VISITED']);

export const visitPlans = pgTable('visit_plans', {
	id: uuid('id').primaryKey().defaultRandom(),
	entityId: varchar('entity_id').notNull(),
	entityName: varchar('entity_name', { length: 100 }).notNull(),
	entityType: varchar('entity_type', { length: 50 }).notNull(),
	segment: segmentEnum('segment').notNull(),
	entityRegion: varchar('entity_region', { length: 50 }).notNull(),
	visitDate: date('visit_date', { mode: 'string' }).notNull(),
	salesName: varchar('sales_name', { length: 100 }),
	status: statusEnum('status').notNull().default('NOT_VISITED'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type VisitPlan = typeof visitPlans.$inferSelect;
export type NewVisitPlan = typeof visitPlans.$inferInsert;
