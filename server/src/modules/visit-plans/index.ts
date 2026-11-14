import { appLogger } from '@/common/logger';
import { authPlugin } from '@common/middleware/auth-guard';
import { Elysia, t } from 'elysia';
import {
	changeStatusVisitPlansPayloadSchema,
	createVisitPlansPayloadSchema,
	visitPlansListQuerySchema,
} from './schema';
import * as visitPlansService from './service';

export const visitPlansModule = new Elysia({ prefix: '/api/activities' })
	.use(authPlugin)
	.get(
		'/',
		async ({ query }) => {
			appLogger.info({ query }, '[REQUEST] Get all visit plan');

			const visitPlans = await visitPlansService.getAllVisitPlans(query);
			return {
				data: visitPlans,
			};
		},
		{
			auth: true,
			query: visitPlansListQuerySchema,
			detail: {
				tags: ['Activities'],
				summary: 'Get all activities',
			},
		},
	)
	.get(
		'/:activityId',
		async ({ params }) => {
			appLogger.info({ params }, '[REQUEST] Get visit plan by id');

			const visitPlan = await visitPlansService.getVisitPlanById(params.activityId);
			return {
				data: visitPlan,
			};
		},
		{
			auth: true,
			params: t.Object({
				activityId: t.String({
					format: 'uuid',
					error: 'Parameter activityId is required and must be valid UUID',
				}),
			}),
			detail: {
				tags: ['Activities'],
				summary: 'Get activity by id',
			},
		},
	)
	.post(
		'/',
		async ({ body, set }) => {
			appLogger.info({ body }, '[REQUEST] Create visit plan');

			const visitPlan = await visitPlansService.createVisitPlan(body);

			set.status = 201;
			return {
				message: 'Activity created successfully',
				data: visitPlan,
			};
		},
		{
			auth: true,
			body: createVisitPlansPayloadSchema,
			detail: {
				tags: ['Activities'],
				summary: 'Create activity',
			},
		},
	)
	.put(
		'/:visitPlanId',
		async ({ params, body, set }) => {
			appLogger.info({ params, body }, '[REQUEST] Change status visit plan');

			const visitPlan = await visitPlansService.changeStatusVisitPlan(params.visitPlanId, body);

			if (!visitPlan) {
				set.status = 404;
				return { error: 'Not Found', message: 'Visit plan not found' };
			}

			return {
				message: 'Activity updated successfully',
				data: visitPlan,
			};
		},
		{
			auth: true,
			params: t.Object({
				visitPlanId: t.String({
					format: 'uuid',
					error: 'Parameter activityId is required and must be valid UUID',
				}),
			}),
			body: changeStatusVisitPlansPayloadSchema,
			detail: {
				tags: ['Activities'],
				summary: 'Change status activity',
			},
		},
	);
