import type { Entity } from '@/common/db/schema';
import { ResourceNotFound } from '@/common/errors/resource-notfound';
import * as entitiesService from '../entities/service';
import * as visitPlansRepo from './repository';
import type {
	ChangeStatusVisitPlansPayload,
	CreateVisitPlansPayload,
	VisitPlansListQuery,
} from './schema';

export const getAllVisitPlans = async (query?: VisitPlansListQuery) => {
	return await visitPlansRepo.getAllVisitPlans(query);
};

export const getVisitPlanById = async (visitPlanId: string) => {
	const res = await visitPlansRepo.getVisitPlanById(visitPlanId);

	if (!res) throw new ResourceNotFound('Visit plan not exist');

	return res;
};

export const createVisitPlan = async (payload: CreateVisitPlansPayload) => {
	const entity = await entitiesService.getEntityByUnknownId(payload.entityId);

	// Check if entityId data
	if (!entity) throw new ResourceNotFound('Entity not exist');

	// Generate custom entityId for visit_plans.entity_id (Data combination)
	// entities.name-entities.type-entities.segment-entities.region
	const generateEntityId = (entity: Partial<Entity>) => {
		const cleanUpStr = (str?: string) => str?.replaceAll(' ', '');
		const name = cleanUpStr(entity?.name);
		const type = cleanUpStr(entity?.type);
		const segment = cleanUpStr(entity?.segment);
		const region = cleanUpStr(entity?.region);
		return `${name}-${type}-${segment}-${region}`;
	};

	const newPayload: CreateVisitPlansPayload & {
		entity: Pick<Entity, 'name' | 'type' | 'region'>;
	} = {
		...payload,
		entityId: generateEntityId({ ...entity, segment: payload.segment }),
		entity,
	};
	return visitPlansRepo.createVisitPlan(newPayload);
};

export const changeStatusVisitPlan = async (
	visitPlanId: string,
	payload: ChangeStatusVisitPlansPayload,
) => {
	const visitPlan = await visitPlansRepo.getVisitPlanById(visitPlanId);

	if (!visitPlan) throw new ResourceNotFound('Visit plan not exist');

	return visitPlansRepo.changeStatusVisitPlan(visitPlan.id, payload);
};
