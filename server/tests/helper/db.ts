import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { db } from '../../src/common/db';
import { entities } from '../../src/common/db/schema';

const dbUrl = new URL(process.env.DATABASE_URL!);
const dbName = dbUrl.pathname.slice(1);

// Pengaman: test tidak boleh menyentuh database selain *-testing
function assertTestDb() {
	if (process.env.NODE_ENV !== 'test' || !dbName.endsWith('-testing')) {
		throw new Error(`Menolak menjalankan test di database "${dbName}"`);
	}
}

// Koneksi ke database bawaan "postgres" untuk CREATE / DROP DATABASE
function adminClient() {
	const adminUrl = new URL(dbUrl);
	adminUrl.pathname = '/postgres';
	return postgres(adminUrl.toString(), { max: 1 });
}

let closed = false;

export async function closeDb() {
	if (closed) return;
	closed = true;
	await db.$client.end(); // kalau error, export `client` dari modul db dan panggil client.end()
}

// Dipanggil sekali per run (tests/setup.ts)
export async function setupTestDb() {
	assertTestDb();

	const admin = adminClient();
	const [exists] = await admin`SELECT 1 FROM pg_database WHERE datname = ${dbName}`;
	if (!exists) await admin.unsafe(`CREATE DATABASE "${dbName}"`);
	await admin.end();

	await migrate(db, { migrationsFolder: './drizzle' }); // sesuaikan dengan "out" di drizzle.config.ts
}

// Dipanggil di beforeEach tiap file test
export async function resetTables() {
	assertTestDb();
	await db.execute(sql`TRUNCATE TABLE visit_plans, entities RESTART IDENTITY CASCADE`);
}

// Dipanggil sekali per run setelah semua test selesai (tests/setup.ts)
export async function dropTestDb() {
	assertTestDb();
	await closeDb(); // koneksi harus ditutup dulu sebelum DROP

	const admin = adminClient();
	await admin.unsafe(`DROP DATABASE IF EXISTS "${dbName}" WITH (FORCE)`); // FORCE butuh Postgres 13+
	await admin.end();
}

export async function seedEntity() {
	return await db
		.insert(entities)
		.values([
			{
				name: 'Entity 1',
				type: 'Industry',
				segment: 'B2B',
				region: 'Bandung',
			},
			{
				name: 'Entity 2',
				type: 'Company',
				segment: 'B2G',
				region: 'Jakarta',
			},
			{
				name: 'Entity 3',
				type: 'Laboratorium',
				segment: 'B2G',
				region: 'Medan',
			},
		])
		.returning();
}
