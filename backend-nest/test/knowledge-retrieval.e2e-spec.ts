import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, login } from './utils/createTestApp';
import { InMemoryStoreService } from '../src/modules/memory/in-memory-store.service';

// Uses the deterministic fake embeddings provider (EMBEDDINGS_PROVIDER=fake in
// setup-env): a hashed bag-of-words, so texts sharing words score higher and
// retrieval is reproducible without OpenAI/Atlas.
describe('Knowledge retrieval (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    app = await createTestApp();
    token = await login(app, 'alice@example.com', 'password');
  });

  afterEach(async () => {
    await app.close();
  });

  const upload = (
    authToken: string,
    { filename, content }: { filename: string; content: string },
  ) =>
    request(app.getHttpServer())
      .post('/knowledge/documents')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', Buffer.from(content), { filename, contentType: 'text/plain' });

  const retrieve = (authToken: string, query: string) =>
    request(app.getHttpServer())
      .post('/knowledge/retrieval')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ query });

  it('requires a token', async () => {
    const res = await request(app.getHttpServer())
      .post('/knowledge/retrieval')
      .send({ query: 'ec2' });
    expect(res.status).toBe(401);
  });

  it('rejects an empty query (400)', async () => {
    const res = await retrieve(token, '');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('stores a 1536-dim embedding on each ingested chunk', async () => {
    const created = await upload(token, {
      filename: 'doc.txt',
      content: 'ec2 compute\n\ns3 storage',
    });
    const chunks = app
      .get(InMemoryStoreService)
      .knowledgeChunks.filter((c) => c.documentId === created.body.document.id);
    expect(chunks).toHaveLength(2);
    expect(chunks.every((c) => c.embedding.length === 1536)).toBe(true);
  });

  it('returns only relevant chunks and never the embedding', async () => {
    await upload(token, {
      filename: 'aws.txt',
      content: 'ec2 compute service\n\ns3 storage bucket',
    });

    const res = await retrieve(token, 'ec2 compute');
    expect(res.status).toBe(201);
    expect(res.body.results.length).toBeGreaterThanOrEqual(1);

    const top = res.body.results[0];
    expect(top.text).toContain('ec2');
    // chunkId is exposed (needed to hydrate citations); embedding is never.
    expect(Object.keys(top).sort()).toEqual([
      'chunkId',
      'chunkIndex',
      'documentId',
      'documentName',
      'score',
      'text',
    ]);
    expect(top).not.toHaveProperty('embedding');
    // The unrelated S3 chunk is below minScore and excluded.
    expect(
      res.body.results.some((r: { text: string }) => r.text.includes('s3')),
    ).toBe(false);
  });

  it('orders results by descending score', async () => {
    await upload(token, {
      filename: 'order.txt',
      content: 'ec2 compute service\n\nec2 only',
    });

    const res = await retrieve(token, 'ec2 compute');
    const scores = res.body.results.map((r: { score: number }) => r.score);
    expect(scores.length).toBeGreaterThanOrEqual(2);
    expect(scores[0]).toBeGreaterThanOrEqual(scores[1]);
    expect(res.body.results[0].text).toContain('compute');
  });

  it('applies the minimum-score filter (no matches → empty)', async () => {
    await upload(token, { filename: 'aws.txt', content: 'ec2 compute service' });

    const res = await retrieve(token, 'banana smoothie recipe');
    expect(res.status).toBe(201);
    expect(res.body.results).toEqual([]);
  });

  it('caps results at topK = 5', async () => {
    const paragraphs = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot']
      .map((word) => `ec2 ${word}`)
      .join('\n\n');
    await upload(token, { filename: 'many.txt', content: paragraphs });

    const res = await retrieve(token, 'ec2');
    expect(res.body.results).toHaveLength(5);
  });

  it("never returns another user's chunks", async () => {
    const bobToken = await login(app, 'bob@example.com', 'password');
    const aliceDoc = await upload(token, {
      filename: 'alice.txt',
      content: 'ec2 compute service',
    });
    await upload(bobToken, { filename: 'bob.txt', content: 'ec2 compute service' });

    const res = await retrieve(token, 'ec2 compute');
    expect(res.body.results.length).toBeGreaterThanOrEqual(1);
    expect(
      res.body.results.every(
        (r: { documentId: string }) => r.documentId === aliceDoc.body.document.id,
      ),
    ).toBe(true);
  });
});
