import { appLogger } from '@/common/logger';
import { withAuth } from '@common/middleware/auth-guard';
import { Elysia, t } from 'elysia';
import { EntityListQuerySchema } from './schema';
import * as service from './service';

export const entitiesModule = withAuth(new Elysia({ prefix: '/api/entities' }))
	.get(
		'/',
		async ({ query }) => {
			appLogger.info({ query }, '[REQUEST] Get All entities');

			const entities = await service.getAllEntities(query);
			return {
				data: entities,
			};
		},
		{
			auth: true,
			query: EntityListQuerySchema,
			detail: {
				tags: ['Entities'],
				summary: 'Get all entities',
				description:
					'Return list of entity from master data, if master data is empty will returning entity from history',
			},
		},
	)
	.get(
		'/:entityId',
		async ({ params }) => {
			appLogger.info({ params }, '[REQUEST] Get entity by id');

			const entity = await service.getEntityById(params.entityId);
			return {
				data: entity,
			};
		},
		{
			auth: true,
			params: t.Object({
				entityId: t.String({
					description: 'Entity id can be UUID or just plain string',
				}),
			}),
			detail: {
				tags: ['Entities'],
				summary: 'Get entity by id',
				description: 'Return entity from master data or from history',
			},
		},
	);
