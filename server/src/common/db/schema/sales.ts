import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const sales = pgTable('sales', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Sales = typeof sales.$inferSelect;
export type NewSales = typeof sales.$inferInsert;
