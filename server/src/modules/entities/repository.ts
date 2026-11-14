import { db } from '@/common/db';
import { entities, visitPlans } from '@/common/db/schema';
import { and, eq, like, sql } from 'drizzle-orm';
import type { EntityListQuery } from './schema';

export const getAllEntities = async (filter?: EntityListQuery) => {
	return await db
		.select()
		.from(entities)
		.where(
			and(
				filter?.search
					? like(sql`(lower(${entities.name}))`, `%${filter.search.toLowerCase()}%`)
					: undefined,
				filter?.segment ? eq(entities.segment, filter.segment) : undefined,
			),
		);
};

export const getAllEntitiesFromVisitPlan = async (filter?: EntityListQuery) => {
	return await db
		.selectDistinctOn([visitPlans.entityId], {
			id: visitPlans.entityId,
			name: visitPlans.entityName,
			type: visitPlans.entityType,
			segment: visitPlans.segment,
			region: visitPlans.entityRegion,
			createdAt: sql<string>`current_timestamp`, // fake createdAt
			updatedAt: sql<string>`current_timestamp`, // fakse updatedAt
		})
		.from(visitPlans)
		.where(
			and(
				filter?.search
					? like(sql`(lower(${visitPlans.entityName}))`, `%${filter.search.toLowerCase()}%`)
					: undefined,
				filter?.segment ? eq(visitPlans.segment, filter.segment) : undefined,
			),
		);
};

export const getEntityById = async (entityId: string) => {
	const [res] = await db.select().from(entities).limit(1).where(eq(entities.id, entityId));

	return res;
};

export const getEntityByVisitPlanEntityId = async (visitPlanEntityId: string) => {
	const [res] = await db
		.selectDistinctOn([visitPlans.entityId], {
			id: visitPlans.entityId,
			name: visitPlans.entityName,
			type: visitPlans.entityType,
			segment: visitPlans.segment,
			region: visitPlans.entityRegion,
			createdAt: sql<string>`current_timestamp`, // fake createdAt
			updatedAt: sql<string>`current_timestamp`, // fakse updatedAt
		})
		.from(visitPlans)
		.limit(1)
		.where(eq(visitPlans.entityId, visitPlanEntityId));

	return res;
};
