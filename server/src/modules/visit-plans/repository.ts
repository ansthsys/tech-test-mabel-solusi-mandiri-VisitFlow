import { db } from '@/common/db';
import { type Entity, visitPlans } from '@/common/db/schema';
import { and, eq, gte, like, lte, sql } from 'drizzle-orm';
import type {
	ChangeStatusVisitPlansPayload,
	CreateVisitPlansPayload,
	VisitPlansListQuery,
} from './schema';

export const getAllVisitPlans = async (filter?: VisitPlansListQuery) => {
	return await db
		.selectDistinct()
		.from(visitPlans)
		.where(
			and(
				filter?.search
					? like(sql`lower(${visitPlans.entityName})`, `%${filter?.search}%`)
					: undefined,
				filter?.segment ? eq(visitPlans.segment, filter?.segment) : undefined,
				filter?.status === undefined || filter?.status === null
					? undefined
					: eq(visitPlans.status, filter.status),
				filter?.from ? gte(visitPlans.visitDate, filter.from) : undefined,
				filter?.to ? lte(visitPlans.visitDate, filter.to) : undefined,
			),
		);
};

export const getVisitPlanById = async (visitPlanId: string) => {
	const [visitPlan] = await db
		.select()
		.from(visitPlans)
		.where(eq(visitPlans.id, visitPlanId))
		.limit(1);

	return visitPlan;
};

export const createVisitPlan = async ({
	entityId,
	entity,
	segment,
	visitDate,
}: CreateVisitPlansPayload & {
	entity: Pick<Entity, 'name' | 'type' | 'region'>;
}) => {
	const [res] = await db
		.insert(visitPlans)
		.values({
			entityId,
			entityName: entity.name,
			entityType: entity.type,
			segment: segment,
			entityRegion: entity.region,
			visitDate,
		})
		.returning();

	return res;
};

export const changeStatusVisitPlan = async (
	visitPlanId: string,
	{ status, salesName }: ChangeStatusVisitPlansPayload,
) => {
	const [res] = await db
		.update(visitPlans)
		.set({
			status,
			salesName,
			updatedAt: new Date(),
		})
		.where(eq(visitPlans.id, visitPlanId))
		.returning();

	return res;
};
