import { beforeEach, describe, expect, it } from 'bun:test';
import { createApp } from '../src/app';
import { getSessionCookie } from './helper/auth';
import { resetTables, seedEntity } from './helper/db';

const app = createApp();
let _cookie: string;

beforeEach(async () => {
	await resetTables();
	_cookie = await getSessionCookie();
});

describe('Entity module', () => {
	describe('Positive test', () => {
		it('Should return 200 with list entity without filter', async () => {
			const seed = await seedEntity();

			const res = await app.handle(
				new Request('http://localhost:3000/api/entities', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Cookie: _cookie,
					},
				}),
			);
			const body = await res.json();

			expect(res.status).toBe(200);
			expect(body).toHaveProperty('data');
			expect(body.data).toHaveLength(3);
			expect(body.data).toStrictEqual(seed);
		});

		it('Should return 200 with list entity with filter', async () => {
			await seedEntity();

			const res = await app.handle(
				new Request('http://localhost:3000/api/entities?search=ntity&segment=B2G', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Cookie: _cookie,
					},
				}),
			);
			const body = await res.json();

			expect(res.status).toBe(200);
			expect(body).toHaveProperty('data');
			expect(body.data).toHaveLength(2);
		});

		it('Should return 200 with exact data from entity id', async () => {
			const seed = await seedEntity();
			const entity = seed[0];

			const res = await app.handle(
				new Request(`http://localhost:3000/api/entities/${entity.id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Cookie: _cookie,
					},
				}),
			);
			const body = await res.json();

			expect(res.status).toBe(200);
			expect(body).toHaveProperty('data');
			expect(body.data).toHaveProperty('id');
			expect(body.data.id).toBe(entity.id);
		});
	});

	describe('Negative test', () => {
		it('Cannot access all entities route before login', async () => {
			const allEndpoint = await app.handle(new Request('http://localhost:3000/api/entities'));
			const getSingleEndpoint = await app.handle(
				new Request('http://localhost:3000/api/entities/anyId'),
			);

			expect(allEndpoint.status).toBe(401);
			expect(getSingleEndpoint.status).toBe(401);
		});

		it('Should return 404 accessing invalid entity id', async () => {
			const res = await app.handle(
				new Request('http://localhost:3000/api/entities/wrong-id', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Cookie: _cookie,
					},
				}),
			);
			const body = await res.json();

			expect(res.status).toBe(404);
			expect(body).toHaveProperty('error');
			expect(body.error).toBe('Resource not found');
		});
	});
});
