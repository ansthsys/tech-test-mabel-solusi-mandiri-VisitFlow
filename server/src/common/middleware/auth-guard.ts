import { auth } from '@common/config/auth';
import { Elysia } from 'elysia';

/**
 * Authentication plugin
 * Derives user and session from Better Auth and exposes the `auth` macro.
 * Use with `new Elysia().use(authPlugin)` before defining protected routes.
 */
export const authPlugin = new Elysia({ name: 'auth-plugin' })
	.derive({ as: 'global' }, async ({ request }) => {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		return {
			user: session?.user ?? null,
			session: session?.session ?? null,
		};
	})
	.macro({
		auth(enabled: boolean) {
			if (!enabled) return;

			return {
				beforeHandle({ user, set }) {
					if (!user) {
						set.status = 401;
						return {
							error: 'Unauthorized',
							message: 'Please login first',
						};
					}
				},
			};
		},
	});
