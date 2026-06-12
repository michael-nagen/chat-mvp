import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, login } from './utils/createTestApp';

describe('Messages (e2e)', () => {
  let app: INestApplication;
  let token: string;

  const auth = () => `Bearer ${token}`;

  beforeEach(async () => {
    app = await createTestApp();
    token = await login(app, 'alice@example.com', 'password');
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /conversations/:id/messages', () => {
    it('requires a token', async () => {
      const res = await request(app.getHttpServer()).get('/conversations/c1/messages');
      expect(res.status).toBe(401);
    });

    it('paginates chronologically across the over-fetch boundary', async () => {
      const first = await request(app.getHttpServer())
        .get('/conversations/c1/messages?limit=2')
        .set('Authorization', auth());

      expect(first.status).toBe(200);
      expect(first.body.messages.map((m: { id: string }) => m.id)).toEqual(['m1', 'm2']);
      expect(first.body.nextCursor).toBe('m2');

      const second = await request(app.getHttpServer())
        .get('/conversations/c1/messages?limit=2&cursor=m2')
        .set('Authorization', auth());

      expect(second.body.messages.map((m: { id: string }) => m.id)).toEqual(['m3']);
      expect(second.body.nextCursor).toBeNull();
    });

    it('exposes createdAt as timestamp and the raw senderId', async () => {
      const res = await request(app.getHttpServer())
        .get('/conversations/c1/messages?limit=1')
        .set('Authorization', auth());

      expect(res.body.messages[0]).toEqual({
        id: 'm1',
        conversationId: 'c1',
        senderId: 'u1',
        content: 'Hey Bob!',
        timestamp: '2026-06-04T08:00:00.000Z',
      });
    });

    it('forbids non-participants from reading a conversation with 403 FORBIDDEN', async () => {
      const signup = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'outsider@example.com', name: 'Outsider', password: 'secret1' });
      const outsiderToken = signup.body.token;

      const res = await request(app.getHttpServer())
        .get('/conversations/c1/messages')
        .set('Authorization', `Bearer ${outsiderToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('returns 404 CONVERSATION_NOT_FOUND for an unknown conversation', async () => {
      const res = await request(app.getHttpServer())
        .get('/conversations/does-not-exist/messages')
        .set('Authorization', auth());

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('CONVERSATION_NOT_FOUND');
    });

    it.each([
      ['limit=abc'],
      ['limit=0'],
      ['limit=101'],
    ])('rejects invalid query %s with 400 VALIDATION_ERROR', async (query) => {
      const res = await request(app.getHttpServer())
        .get(`/conversations/c1/messages?${query}`)
        .set('Authorization', auth());

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /conversations/:id/messages', () => {
    it('creates a message and updates the conversation lastMessage', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations/c1/messages')
        .set('Authorization', auth())
        .send({ content: 'a fresh message' });

      expect(res.status).toBe(201);
      expect(res.body.message.id).toMatch(/^m-/);
      expect(res.body.message.senderId).toBe('u1');
      expect(res.body.message.content).toBe('a fresh message');
      expect(typeof res.body.message.timestamp).toBe('string');

      const list = await request(app.getHttpServer())
        .get('/conversations')
        .set('Authorization', auth());
      const c1 = list.body.conversations.find((c: { id: string }) => c.id === 'c1');
      expect(c1.lastMessage).toBe('a fresh message');
    });

    it('rejects empty content with 400 VALIDATION_ERROR', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations/c1/messages')
        .set('Authorization', auth())
        .send({ content: '' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('forbids non-participants from posting with 403 FORBIDDEN', async () => {
      const signup = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'outsider2@example.com', name: 'Outsider Two', password: 'secret1' });

      const res = await request(app.getHttpServer())
        .post('/conversations/c1/messages')
        .set('Authorization', `Bearer ${signup.body.token}`)
        .send({ content: 'hi' });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });
});
