import type { Entity } from '@/common/db/schema';
import { ResourceNotFound } from '@/common/errors/resource-notfound';
import * as entityRepo from './repository';
import type { EntityListQuery } from './schema';

export const getAllEntities = async (query?: EntityListQuery) => {
	const entities = await entityRepo.getAllEntities(query);

	if (entities.length < 1) {
		// fallback
		return await entityRepo.getAllEntitiesFromVisitPlan(query);
	}

	return entities;
};

export const getEntityById = async (entityId: string) => {
	const entity = await getEntityByUnknownId(entityId);

	if (!entity) throw new ResourceNotFound('Entity not exist');

	return entity;
};

export const getEntityByUnknownId = async (unknownId: string) => {
	const regexExp =
		/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

	// Manual check UUID
	const isUuid = regexExp.test(unknownId);

	let entity: Entity | undefined;

	if (isUuid) {
		entity = await entityRepo.getEntityById(unknownId);
	} else {
		entity = await entityRepo.getEntityByVisitPlanEntityId(unknownId);
	}

	return entity;
};
