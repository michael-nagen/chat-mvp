import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, login } from './utils/createTestApp';

describe('Conversations (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    app = await createTestApp();
    token = await login(app, 'alice@example.com', 'password');
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /conversations', () => {
    it('requires a token', async () => {
      const res = await request(app.getHttpServer()).get('/conversations');
      expect(res.status).toBe(401);
    });

    it("returns the caller's conversations sorted by updatedAt DESC", async () => {
      const res = await request(app.getHttpServer())
        .get('/conversations')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      const ids = res.body.conversations.map((c: { id: string }) => c.id);
      expect(ids).toEqual(['c1', 'c2']);
      expect(
        res.body.conversations.every((c: { participantIds: string[] }) =>
          c.participantIds.includes('u1'),
        ),
      ).toBe(true);
    });
  });

  describe('POST /conversations', () => {
    it('creates a conversation with a recipient by email (returned directly)', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'bob@example.com' });

      expect(res.status).toBe(201);
      expect(res.body.id).toMatch(/^c-/);
      expect(res.body.title).toBe('bob@example.com');
      expect(res.body.participantIds).toEqual(['u1', 'u2']);
      expect(res.body.lastMessage).toBe('');
    });

    it('returns 404 NOT_FOUND for an unknown recipient email', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'ghost@example.com' });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('returns 400 VALIDATION_ERROR for a non-email body', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'not-an-email' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
