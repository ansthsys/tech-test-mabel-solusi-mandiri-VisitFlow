import { afterAll, beforeAll } from 'bun:test';

beforeAll(async () => {
	const { setupTestDb } = await import('./helper/db');
	await setupTestDb();
});

afterAll(async () => {
	const { closeDb, dropTestDb, resetTables } = await import('./helper/db');
	await resetTables();
	await closeDb();
	await dropTestDb();
});
