import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, login } from './utils/createTestApp';

describe('Me (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /me', () => {
    it('requires a token', async () => {
      const res = await request(app.getHttpServer()).get('/me');
      expect(res.status).toBe(401);
    });

    it('returns the authenticated user without the password', async () => {
      const token = await login(app, 'alice@example.com', 'password');
      const res = await request(app.getHttpServer())
        .get('/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 'u1', email: 'alice@example.com', name: 'Alice' });
      expect(res.body.password).toBeUndefined();
    });
  });
});
