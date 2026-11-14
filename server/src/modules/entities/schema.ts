import { segmentEnum } from '@/common/db/schema';
import { t } from 'elysia';

export const EntityListQuerySchema = t.Object({
	search: t.Optional(t.String()),
	segment: t.Optional(t.UnionEnum(['', ...segmentEnum.enumValues])),
});

export type EntityListQuery = (typeof EntityListQuerySchema)['static'];
