import { describe, expect, it } from 'bun:test';
import { createApp } from '../src/app';

const app = createApp();

describe('Health Module', () => {
	it('GET /health returns ok status', async () => {
		const response = await app.handle(new Request('http://localhost:3000/health'));
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toHaveProperty('status');
		expect(body.status).toBe('ok');
		expect(body.database).toBe('healthy');
		expect(body).toHaveProperty('timestamp');
		expect(body).toHaveProperty('uptime');
		expect(body).toHaveProperty('responseTime');
	});
});
