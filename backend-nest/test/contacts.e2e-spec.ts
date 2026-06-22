import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, login } from './utils/createTestApp';

describe('Contacts (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    app = await createTestApp();
    token = await login(app, 'alice@example.com', 'password');
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /me/contacts', () => {
    it('requires a token', async () => {
      const res = await request(app.getHttpServer()).get('/me/contacts');
      expect(res.status).toBe(401);
    });

    it("returns the caller's contacts as user summaries", async () => {
      const res = await request(app.getHttpServer())
        .get('/me/contacts')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      // Alice is seeded with Bob as her only contact.
      expect(res.body).toEqual([
        { id: 'u2', displayName: 'Bob Brown', avatarUrl: null },
      ]);
    });
  });
});
