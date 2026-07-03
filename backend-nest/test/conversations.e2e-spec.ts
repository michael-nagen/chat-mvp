import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, login, setContacts } from './utils/createTestApp';

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

      const [c1] = res.body.conversations;
      expect(c1.participants).toEqual(
        expect.arrayContaining([
          { id: 'u1', displayName: 'Alice Anderson', avatarUrl: null },
          { id: 'u2', displayName: 'Bob Brown', avatarUrl: null },
        ]),
      );
    });
  });

  // Signs up a user and returns their generated id, so the create endpoint can
  // be exercised with real participants.
  const signup = async (firstName: string, lastName: string): Promise<string> => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `${firstName.toLowerCase()}@example.com`,
        firstName,
        lastName,
        password: 'password',
      });
    return res.body.user.id as string;
  };

  describe('POST /conversations (type: dm)', () => {
    it('requires a token', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .send({ type: 'dm', contactIds: ['u2'] });
      expect(res.status).toBe(401);
    });

    it('creates a DM (201) with a name-derived title and resolved participants', async () => {
      const carolId = await signup('Carol', 'Carter');
      setContacts(app, 'u1', [carolId]);

      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'dm', contactIds: [carolId] });

      expect(res.status).toBe(201);
      expect(res.body.id).toMatch(/^c-/);
      expect(res.body.title).toBe('Carol Carter');
      expect(res.body.lastMessage).toBe('');
      expect(res.body.participants).toEqual(
        expect.arrayContaining([
          { id: 'u1', displayName: 'Alice Anderson', avatarUrl: null },
          expect.objectContaining({ displayName: 'Carol Carter' }),
        ]),
      );
    });

    it('supports a multi-participant DM titled by the other members', async () => {
      const carolId = await signup('Carol', 'Carter');
      const daveId = await signup('Dave', 'Davis');
      setContacts(app, 'u1', [carolId, daveId]);

      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'dm', contactIds: [carolId, daveId] });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Carol Carter, Dave Davis');
    });

    it('is idempotent and order-independent (200 with the existing DM)', async () => {
      const carolId = await signup('Carol', 'Carter');
      const daveId = await signup('Dave', 'Davis');
      setContacts(app, 'u1', [carolId, daveId]);

      const first = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'dm', contactIds: [carolId, daveId] });
      expect(first.status).toBe(201);

      const second = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'dm', contactIds: [daveId, carolId] });

      expect(second.status).toBe(200);
      expect(second.body.id).toBe(first.body.id);
    });

    it('returns the existing seeded DM rather than duplicating it', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'dm', contactIds: ['u2'] });

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('c1');
    });

    it('returns 404 NOT_FOUND when a participant id does not exist', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'dm', contactIds: ['ghost'] });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('returns 400 VALIDATION_ERROR when only the current user resolves', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'dm', contactIds: ['u1'] });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 403 FORBIDDEN when a participant is not a contact', async () => {
      const eveId = await signup('Eve', 'Evans');
      // Eve is a real user but deliberately not added to Alice's contacts.

      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'dm', contactIds: [eveId] });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('returns 400 VALIDATION_ERROR for too many participants', async () => {
      const tooMany = Array.from({ length: 16 }, (_, i) => `x${i}`);
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'dm', contactIds: tooMany });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 VALIDATION_ERROR for an empty participant list', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'dm', contactIds: [] });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /conversations (type: group)', () => {
    it('requires a token', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .send({ type: 'group', contactIds: ['u2'] });
      expect(res.status).toBe(401);
    });

    it('creates a group (201) with the provided title', async () => {
      const carolId = await signup('Carol', 'Carter');
      setContacts(app, 'u1', ['u2', carolId]);

      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'group', contactIds: ['u2', carolId], title: 'Team' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Team');
      expect(res.body.participants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'u1' }),
          expect.objectContaining({ id: 'u2' }),
          expect.objectContaining({ displayName: 'Carol Carter' }),
        ]),
      );
    });

    it('falls back to a name-derived title when none is provided', async () => {
      const carolId = await signup('Carol', 'Carter');
      setContacts(app, 'u1', ['u2', carolId]);

      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'group', contactIds: ['u2', carolId] });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Bob Brown, Carol Carter');
    });

    it('allows multiple groups with the exact same participants', async () => {
      const first = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'group', contactIds: ['u2'], title: 'One' });
      const second = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'group', contactIds: ['u2'], title: 'Two' });

      expect(first.status).toBe(201);
      expect(second.status).toBe(201);
      expect(first.body.id).not.toBe(second.body.id);
    });

    it('returns 400 VALIDATION_ERROR for too many participants', async () => {
      const tooMany = Array.from({ length: 31 }, (_, i) => `x${i}`);
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'group', contactIds: tooMany });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 403 FORBIDDEN when a participant is not a contact', async () => {
      const eveId = await signup('Eve', 'Evans');

      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'group', contactIds: ['u2', eveId], title: 'Team' });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('POST /conversations (type: assistant)', () => {
    it('requires a token', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .send({ type: 'assistant' });
      expect(res.status).toBe(401);
    });

    it('creates an assistant conversation (201) with the caller and the assistant', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'assistant' });

      expect(res.status).toBe(201);
      expect(res.body.type).toBe('assistant');
      expect(res.body.participants).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: 'u1' })]),
      );
    });
  });

  describe('POST /conversations (type: tutor)', () => {
    it('requires a token', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .send({ type: 'tutor' });
      expect(res.status).toBe(401);
    });

    it('creates a tutor conversation (201) with the caller and the tutor', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'tutor' });

      expect(res.status).toBe(201);
      expect(res.body.type).toBe('tutor');
      expect(res.body.title).toBe('RAG Tutor');
      expect(res.body.participants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'u1' }),
          expect.objectContaining({ id: 'tutor-assistant' }),
        ]),
      );
    });

    it('ignores contactIds for a tutor conversation', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'tutor', contactIds: ['u2'] });

      expect(res.status).toBe(201);
      expect(res.body.type).toBe('tutor');
    });
  });

  describe('GET /conversations/:id/assistant/stream (tutor)', () => {
    it('emits a not-implemented event for a tutor conversation', async () => {
      const created = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'tutor' });
      const conversationId = created.body.id as string;

      const res = await request(app.getHttpServer())
        .get(`/conversations/${conversationId}/assistant/stream`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.text).toContain('TUTOR_NOT_IMPLEMENTED');
    });
  });

  describe('POST /conversations (invalid type)', () => {
    it('returns 400 VALIDATION_ERROR for an unsupported type', async () => {
      const res = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'channel' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
