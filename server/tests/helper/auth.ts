import { createApp } from '../../src/app';

export async function getSessionCookie() {
	const app = createApp();

	const res = await app.handle(
		new Request('http://localhost/api/auth/sign-up/email', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				name: 'Tester',
				email: `t${Date.now()}@test.com`,
				password: 'password123',
			}),
		}),
	);

	// Better Auth mengirim cookie sesi di header set-cookie
	return res.headers
		.getSetCookie()
		.map((c) => c.split(';')[0])
		.join('; ');
}
