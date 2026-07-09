import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, login } from './utils/createTestApp';

// Uses the deterministic fake tutor generator + mock retrieval (set via env in
// setup-env), so no OpenAI/Atlas is required and answers are reproducible.
describe('RAG tutor message flow (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    app = await createTestApp();
    token = await login(app, 'alice@example.com', 'password');
  });

  afterEach(async () => {
    await app.close();
  });

  const createConversation = (type: string) =>
    request(app.getHttpServer())
      .post('/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({ type });

  const send = (conversationId: string, content: string) =>
    request(app.getHttpServer())
      .post(`/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content });

  const listMessages = (conversationId: string) =>
    request(app.getHttpServer())
      .get(`/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${token}`);

  it('posts a knowledge_upload event message when uploading into a tutor conversation', async () => {
    const conversation = await createConversation('tutor');
    const conversationId = conversation.body.id as string;

    const uploaded = await request(app.getHttpServer())
      .post('/knowledge/documents')
      .set('Authorization', `Bearer ${token}`)
      .field('conversationId', conversationId)
      .attach('file', Buffer.from('ec2 compute service'), {
        filename: 'notes.txt',
        contentType: 'text/plain',
      });
    expect(uploaded.status).toBe(201);

    const res = await listMessages(conversationId);
    const event = res.body.messages.find(
      (m: { metadata?: { kind?: string } }) =>
        m.metadata?.kind === 'knowledge_upload',
    );
    expect(event).toBeDefined();
    expect(event.senderId).toBe('tutor-assistant');
    expect(event.metadata).toEqual({
      kind: 'knowledge_upload',
      documentId: uploaded.body.document.id,
      documentName: 'notes.txt',
      status: 'completed',
    });
    // The event message carries no chunk text/embeddings.
    expect(event.metadata).not.toHaveProperty('citations');
  });

  it('stores a grounded tutor reply after a user message in a tutor conversation', async () => {
    const conversation = await createConversation('tutor');
    const conversationId = conversation.body.id as string;

    const sent = await send(conversationId, 'What is RAG?');
    expect(sent.status).toBe(201);
    expect(sent.body.message.senderId).toBe('u1');

    const res = await listMessages(conversationId);
    const senders = res.body.messages.map((m: { senderId: string }) => m.senderId);
    expect(senders).toContain('u1');
    expect(senders).toContain('tutor-assistant');

    const reply = res.body.messages.find(
      (m: { senderId: string }) => m.senderId === 'tutor-assistant',
    );
    expect(reply.content).toContain('[Source 1]');

    // Citations are persisted as refs (chunkId + doc info + score), never text.
    expect(reply.metadata.citations).toHaveLength(2);
    expect(reply.metadata.citations[0]).toEqual({
      chunkId: 'mock-chunk-0',
      documentId: 'mock-doc-1',
      documentName: 'mock-rag-intro.md',
      chunkIndex: 0,
      score: 0.82,
    });
    // No text/embedding is ever stored in a citation ref.
    for (const citation of reply.metadata.citations) {
      expect(Object.keys(citation).sort()).toEqual([
        'chunkId',
        'chunkIndex',
        'documentId',
        'documentName',
        'score',
      ]);
    }
  });

  it('stores the safe fallback reply when retrieval is weak/no-context', async () => {
    const conversation = await createConversation('tutor');
    const conversationId = conversation.body.id as string;

    await send(conversationId, 'no-context question about nothing');

    const res = await listMessages(conversationId);
    const reply = res.body.messages.find(
      (m: { senderId: string }) => m.senderId === 'tutor-assistant',
    );
    expect(reply.content).toBe(
      'I could not find relevant information in your uploaded knowledge base for this question.',
    );
    // Fallback answers carry no citations, so no metadata is attached.
    expect(reply.metadata).toBeUndefined();
  });

  it('does not generate a tutor reply for a non-tutor (assistant) conversation', async () => {
    const conversation = await createConversation('assistant');
    const conversationId = conversation.body.id as string;

    await send(conversationId, 'hello there');

    const res = await listMessages(conversationId);
    const senders = res.body.messages.map((m: { senderId: string }) => m.senderId);
    expect(senders).toContain('u1');
    expect(senders).not.toContain('tutor-assistant');
    expect(res.body.messages).toHaveLength(1);
    // Normal messages carry no metadata.
    expect(res.body.messages[0].metadata).toBeUndefined();
  });
});
