import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../app';

const authHeader = (userId: string) => ({ Authorization: `Bearer mock-token-${userId}` });

describe('POST /auth/login', () => {
  it('returns a token and user for a known name', async () => {
    const res = await request(app).post('/auth/login').send({ name: 'Alice' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: 'mock-token-u1', user: { id: 'u1', name: 'Alice' } });
  });

  it('returns 400 for an empty name', async () => {
    const res = await request(app).post('/auth/login').send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 401 for an unknown name', async () => {
    const res = await request(app).post('/auth/login').send({ name: 'Nobody' });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});

describe('conversations routes (auth required)', () => {
  it('rejects requests without a valid token', async () => {
    const res = await request(app).get('/conversations');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('lists the caller conversations', async () => {
    const res = await request(app).get('/conversations').set(authHeader('u1'));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.conversations)).toBe(true);
    expect(res.body.conversations.length).toBeGreaterThanOrEqual(2);
  });

  it('creates a conversation', async () => {
    const res = await request(app)
      .post('/conversations')
      .set(authHeader('u1'))
      .send({ title: 'New room' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New room');
    expect(res.body.participantIds).toEqual(['u1']);
  });

  it('rejects creating a conversation with an empty title', async () => {
    const res = await request(app)
      .post('/conversations')
      .set(authHeader('u1'))
      .send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('messages routes', () => {
  it('lists messages for a conversation the caller belongs to', async () => {
    const res = await request(app).get('/conversations/c1/messages').set(authHeader('u1'));
    expect(res.status).toBe(200);
    expect(res.body.nextCursor).toBeNull();
    expect(res.body.messages.length).toBeGreaterThanOrEqual(3);
  });

  it('labels the sender of the caller own messages as "user"', async () => {
    const res = await request(app).get('/conversations/c1/messages').set(authHeader('u1'));
    const own = res.body.messages.find((m: { id: string }) => m.id === 'm1');
    expect(own.sender).toBe('user');
  });

  it('returns 404 when the caller is a known user but not a participant', async () => {
    // u1 owns this new conversation; u2 is a valid user but not a participant.
    const created = await request(app)
      .post('/conversations')
      .set(authHeader('u1'))
      .send({ title: 'Private to u1' });

    const res = await request(app)
      .get(`/conversations/${created.body.id}/messages`)
      .set(authHeader('u2'));
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('CONVERSATION_NOT_FOUND');
  });

  it('returns 404 for an unknown conversation', async () => {
    const res = await request(app).get('/conversations/does-not-exist/messages').set(authHeader('u1'));
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('CONVERSATION_NOT_FOUND');
  });

  it('creates a message and echoes it back', async () => {
    const res = await request(app)
      .post('/conversations/c1/messages')
      .set(authHeader('u1'))
      .send({ content: 'Hello from the test' });
    expect(res.status).toBe(201);
    expect(res.body.message.content).toBe('Hello from the test');
    expect(res.body.message.sender).toBe('user');
  });

  it('rejects an empty message body', async () => {
    const res = await request(app)
      .post('/conversations/c1/messages')
      .set(authHeader('u1'))
      .send({ content: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
