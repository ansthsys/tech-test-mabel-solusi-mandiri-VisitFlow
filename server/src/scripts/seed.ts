import { auth } from '@/common/config/auth';
import { db } from '@common/db';
import { entities, user } from '@common/db/schema';
import { appLogger } from '@common/logger';
import { eq } from 'drizzle-orm';

/**
 * Database Seed Script (OPTIONAL)
 * Populates the database with sample data for development.
 * * Usage: bun run db:seed
 *
 * WARNING: Only run this in development environments.
 */

async function seed() {
	appLogger.info('[SEED] Starting database seeding...');

	try {
		appLogger.info('[SEED] Check admin account already created...');
		const [adminExists] = await db.select().from(user).where(eq(user.email, 'admin@email.com'));

		if (!adminExists) {
			appLogger.info('[SEED] Creating admin account...');
			const { user: userCreated } = await auth.api.signUpEmail({
				body: {
					name: 'Admin',
					email: 'admin@email.com',
					password: 'Admin123!',
				},
			});

			if (userCreated) {
				appLogger.info('[SEED] Verifying admin account...');
				await db
					.update(user)
					.set({
						emailVerified: true,
					})
					.where(eq(user.id, userCreated.id));
			}
		}

		appLogger.info('[SEED] Creating sample entities...');
		await db
			.insert(entities)
			.values([
				{
					id: '00000000-0000-0000-0000-000000000001',
					name: 'PT Kipas Angin',
					type: 'Perusahaan',
					segment: 'B2B',
					region: 'Bandung',
				},
				{
					id: '00000000-0000-0000-0000-000000000002',
					name: 'PT Kipas Angin',
					type: 'Perusahaan',
					segment: 'B2B',
					region: 'Jakarta',
				},
				{
					id: '00000000-0000-0000-0000-000000000003',
					name: 'CV Pendingin Ruangan',
					type: 'Perusahaan',
					segment: 'B2B',
					region: 'Bandung',
				},
				{
					id: '00000000-0000-0000-0000-000000000004',
					name: 'Komdigi',
					type: 'Instansi',
					segment: 'B2G',
					region: 'Jakarta',
				},
				{
					id: '00000000-0000-0000-0000-000000000005',
					name: 'Kelurahan Abc',
					type: 'Instansi',
					segment: 'B2G',
					region: 'Bandung',
				},
			])
			.onConflictDoNothing();

		appLogger.info('[SEED] Database seeding completed successfully');
	} catch (error) {
		appLogger.error({ error }, '[SEED] Seeding failed');
		throw error;
	} finally {
		process.exit(0);
	}
}

seed();
