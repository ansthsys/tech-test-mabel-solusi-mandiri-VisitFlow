import { segmentEnum, visitPlans } from '@/common/db/schema';
import { createInsertSchema, createUpdateSchema } from 'drizzle-typebox';
import { t } from 'elysia';

export const visitPlansListQuerySchema = t.Object({
	search: t.Optional(t.String()),
	segment: t.Optional(t.UnionEnum(['', ...segmentEnum.enumValues])),
	status: t.Optional(t.Boolean()),
	startDate: t.Optional(t.String({ format: 'date' })),
	endDate: t.Optional(t.String({ format: 'date' })),
});

export const _createVisitPlansSchema = createInsertSchema(visitPlans, {
	entityId: t.Union([t.String({ format: 'uuid' }), t.String({ minLength: 1, maxLength: 255 })], {
		description: 'Entity id can be UUID or just plain string',
		error: 'Entity id is required',
	}),
	segment: t.UnionEnum(segmentEnum.enumValues, {
		error: 'Segment is required and must be type of B2G or B2B',
	}),
	visitDate: t.String({
		format: 'date',
		error: 'Visit date required and must be date type',
	}),
});
export const createVisitPlansPayloadSchema = t.Pick(_createVisitPlansSchema, [
	'entityId',
	'segment',
	'visitDate',
]);

export const _updateVisitPlansSchema = createUpdateSchema(visitPlans);
export const updateVisitPlansPayloadSchema = t.Omit(_updateVisitPlansSchema, [
	'id',
	'entityId',
	'createdAt',
	'updatedAt',
]);
export const _changeStatusVisitPlansSchema = createUpdateSchema(visitPlans, {
	status: t.Boolean({ error: 'Status is required and must be valid boolean' }),
	salesName: t.Optional(
		t.String({
			minLength: 1,
			maxLength: 100,
			error: 'Sales name must be at least 1 and maximal 100 length',
		}),
	),
});
export const changeStatusVisitPlansPayloadSchema = t.Pick(_changeStatusVisitPlansSchema, [
	'salesName',
	'status',
]);

export type VisitPlansListQuery = (typeof visitPlansListQuerySchema)['static'];

export type CreateVisitPlansPayload = (typeof createVisitPlansPayloadSchema)['static'];
export type UpdateVisitPlansPayload = (typeof updateVisitPlansPayloadSchema)['static'];
export type ChangeStatusVisitPlansPayload = (typeof changeStatusVisitPlansPayloadSchema)['static'];
