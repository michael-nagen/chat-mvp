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

  type SseFrame = { event: string; data: unknown };

  const parseSse = (raw: string): SseFrame[] =>
    raw
      .split('\n\n')
      .map((frame) => frame.trim())
      .filter((frame) => frame.length > 0)
      .map((frame) => {
        let event = 'message';
        const dataLines: string[] = [];
        for (const line of frame.split('\n')) {
          if (line.startsWith('event:')) event = line.slice(6).trim();
          else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
        }
        const data = dataLines.join('\n');
        return { event, data: data ? JSON.parse(data) : undefined };
      });

  // Consumes the (finite) tutor SSE stream to completion and returns its frames.
  const streamReply = (conversationId: string): Promise<SseFrame[]> =>
    new Promise((resolve, reject) => {
      request(app.getHttpServer())
        .get(`/conversations/${conversationId}/assistant/stream`)
        .set('Authorization', `Bearer ${token}`)
        .buffer(true)
        .parse((res, cb) => {
          let raw = '';
          res.on('data', (chunk: Buffer) => (raw += chunk.toString()));
          res.on('end', () => cb(null, raw));
        })
        .end((err, res) => {
          if (err) return reject(err);
          resolve(parseSse(res.body as unknown as string));
        });
    });

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

  it('streams a grounded tutor reply and persists it exactly once with citations', async () => {
    const conversation = await createConversation('tutor');
    const conversationId = conversation.body.id as string;

    const sent = await send(conversationId, 'What is RAG?');
    expect(sent.status).toBe(201);
    expect(sent.body.message.senderId).toBe('u1');

    // The POST only stores the question; the reply arrives over the stream.
    const afterSend = await listMessages(conversationId);
    expect(
      afterSend.body.messages.map((m: { senderId: string }) => m.senderId),
    ).not.toContain('tutor-assistant');

    const frames = await streamReply(conversationId);
    const tokens = frames.filter((f) => f.event === 'token');
    expect(tokens.length).toBeGreaterThan(0);
    const done = frames.find((f) => f.event === 'done');
    const donePayload = done?.data as { messageId: string; citations: unknown[] };
    expect(donePayload.citations).toHaveLength(2);
    expect((donePayload.citations as Array<{ chunkId: string }>)[0].chunkId).toBe(
      'mock-chunk-0',
    );

    const res = await listMessages(conversationId);
    const replies = res.body.messages.filter(
      (m: { senderId: string }) => m.senderId === 'tutor-assistant',
    );
    // Persisted exactly once — never during the POST and never twice.
    expect(replies).toHaveLength(1);
    const reply = replies[0];
    expect(reply.id).toBe(donePayload.messageId);
    expect(reply.content).toContain('[Source 1]');

    expect(reply.metadata.citations).toHaveLength(2);
    expect(reply.metadata.citations[0]).toEqual({
      chunkId: 'mock-chunk-0',
      documentId: 'mock-doc-1',
      documentName: 'mock-rag-intro.md',
      chunkIndex: 0,
      score: 0.82,
    });
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

  it('streams the safe fallback reply (no citations) when retrieval is weak', async () => {
    const conversation = await createConversation('tutor');
    const conversationId = conversation.body.id as string;

    await send(conversationId, 'no-context question about nothing');

    const frames = await streamReply(conversationId);
    const done = frames.find((f) => f.event === 'done');
    expect((done?.data as { citations: unknown[] }).citations).toHaveLength(0);

    const res = await listMessages(conversationId);
    const replies = res.body.messages.filter(
      (m: { senderId: string }) => m.senderId === 'tutor-assistant',
    );
    expect(replies).toHaveLength(1);
    expect(replies[0].content).toBe(
      'I could not find relevant information in your uploaded knowledge base for this question.',
    );
    // Fallback answers carry no citations, so no metadata is attached.
    expect(replies[0].metadata).toBeUndefined();
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
