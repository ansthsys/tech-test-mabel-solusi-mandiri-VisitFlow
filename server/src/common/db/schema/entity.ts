import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const segmentEnum = pgEnum('segment_enum', ['B2G', 'B2B']);

export const entities = pgTable('entities', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 100 }).notNull(),
	type: varchar('type', { length: 50 }).notNull(),
	segment: segmentEnum('segment').notNull(),
	region: varchar('region', { length: 50 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export type Entity = typeof entities.$inferSelect;
export type NewEntity = typeof entities.$inferInsert;
export type Segment = (typeof segmentEnum.enumValues)[number];
