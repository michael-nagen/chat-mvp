import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, login } from './utils/createTestApp';
import { InMemoryStoreService } from '../src/modules/memory/in-memory-store.service';
import { KnowledgeChunk } from '../src/common/storage/entities';

describe('Knowledge documents (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    app = await createTestApp();
    token = await login(app, 'alice@example.com', 'password');
  });

  afterEach(async () => {
    await app.close();
  });

  // Uploads a buffer as a multipart `file` field for the given user.
  const upload = (
    authToken: string,
    {
      filename,
      content,
      contentType = 'text/plain',
    }: { filename: string; content: string | Buffer; contentType?: string },
  ) =>
    request(app.getHttpServer())
      .post('/knowledge/documents')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', Buffer.from(content as string), { filename, contentType });

  // White-box access to stored chunks (memory driver in tests), the way
  // setContacts reaches into the shared store — there is no GET-chunks endpoint.
  const chunksFor = (documentId: string): KnowledgeChunk[] =>
    app
      .get(InMemoryStoreService)
      .knowledgeChunks.filter((c) => c.documentId === documentId)
      .sort((a, b) => a.chunkIndex - b.chunkIndex);

  describe('POST /knowledge/documents', () => {
    it('requires a token', async () => {
      const res = await request(app.getHttpServer()).post('/knowledge/documents');
      expect(res.status).toBe(401);
    });

    it('uploads a .txt document (201) and returns clean metadata', async () => {
      const res = await upload(token, {
        filename: 'notes.txt',
        content: 'Hello knowledge base',
      });

      expect(res.status).toBe(201);
      expect(res.body.alreadyExisted).toBe(false);
      expect(res.body.document).toEqual({
        id: expect.stringMatching(/^kd-/),
        fileName: 'notes.txt',
        status: 'ready',
        // Single paragraph → one chunk (no longer hardcoded to 0).
        chunkCount: 1,
        createdAt: expect.any(String),
      });
      // Internal-only fields must not leak.
      expect(res.body.document.userId).toBeUndefined();
      expect(res.body.document.contentHash).toBeUndefined();
    });

    it('uploads a .md document (201)', async () => {
      const res = await upload(token, {
        filename: 'readme.md',
        content: '# Title\n\nSome markdown.',
        contentType: 'text/markdown',
      });

      expect(res.status).toBe(201);
      expect(res.body.document.fileName).toBe('readme.md');
    });

    it('rejects an unsupported extension (400)', async () => {
      const res = await upload(token, {
        filename: 'doc.pdf',
        content: 'not really a pdf',
      });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects an empty (whitespace-only) file (400)', async () => {
      const res = await upload(token, {
        filename: 'blank.txt',
        content: '   \n\t  ',
      });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects a file larger than 3MB (400)', async () => {
      const tooBig = Buffer.alloc(3 * 1024 * 1024 + 1, 'a');
      const res = await upload(token, { filename: 'big.txt', content: tooBig });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('is idempotent for identical content (200, same id, no duplicate)', async () => {
      const first = await upload(token, {
        filename: 'dup.txt',
        content: 'same content',
      });
      expect(first.status).toBe(201);
      expect(first.body.alreadyExisted).toBe(false);

      const second = await upload(token, {
        filename: 'dup-renamed.txt',
        content: 'same content',
      });
      expect(second.status).toBe(200);
      expect(second.body.alreadyExisted).toBe(true);
      expect(second.body.document.id).toBe(first.body.document.id);

      const list = await request(app.getHttpServer())
        .get('/knowledge/documents')
        .set('Authorization', `Bearer ${token}`);
      expect(list.body.documents).toHaveLength(1);
    });

    it('lets different users store identical content independently', async () => {
      const bobToken = await login(app, 'bob@example.com', 'password');

      const alice = await upload(token, {
        filename: 'shared.txt',
        content: 'identical bytes',
      });
      const bob = await upload(bobToken, {
        filename: 'shared.txt',
        content: 'identical bytes',
      });

      expect(alice.status).toBe(201);
      expect(bob.status).toBe(201);
      expect(alice.body.document.id).not.toBe(bob.body.document.id);
    });
  });

  describe('chunking (Part 4)', () => {
    it('creates chunks for a .txt upload and chunkCount matches', async () => {
      const res = await upload(token, {
        filename: 'paras.txt',
        content: 'Para one.\n\nPara two.\n\nPara three.',
      });

      expect(res.status).toBe(201);
      expect(res.body.document.chunkCount).toBe(3);

      const chunks = chunksFor(res.body.document.id);
      expect(chunks).toHaveLength(3);
      expect(chunks.map((c) => c.text)).toEqual([
        'Para one.',
        'Para two.',
        'Para three.',
      ]);
      // Every chunk carries owner + document metadata for later retrieval.
      expect(chunks.every((c) => c.userId === 'u1')).toBe(true);
      expect(chunks.every((c) => c.documentName === 'paras.txt')).toBe(true);
      expect(chunks.map((c) => c.chunkIndex)).toEqual([0, 1, 2]);
    });

    it('creates chunks for a .md upload, preserving headings', async () => {
      const res = await upload(token, {
        filename: 'guide.md',
        content: '# Intro\nHello.\n\n## Setup\nInstall.',
        contentType: 'text/markdown',
      });

      expect(res.status).toBe(201);
      expect(res.body.document.chunkCount).toBe(2);

      const chunks = chunksFor(res.body.document.id);
      expect(chunks[0].text).toBe('# Intro\nHello.');
      expect(chunks[1].text).toBe('## Setup\nInstall.');
    });

    it('uses the 800/100 fallback for an oversized section', async () => {
      const res = await upload(token, {
        filename: 'big.txt',
        content: 'a'.repeat(2000),
      });

      expect(res.status).toBe(201);
      // 2000 chars → windows at 0, 700, 1400 = 3 chunks.
      expect(res.body.document.chunkCount).toBe(3);
      expect(chunksFor(res.body.document.id)).toHaveLength(3);
    });

    it('does not duplicate chunks on a duplicate upload', async () => {
      const first = await upload(token, {
        filename: 'dup.txt',
        content: 'one\n\ntwo',
      });
      expect(first.status).toBe(201);
      const id = first.body.document.id as string;
      expect(chunksFor(id)).toHaveLength(2);

      const second = await upload(token, {
        filename: 'dup-again.txt',
        content: 'one\n\ntwo',
      });
      expect(second.status).toBe(200);
      expect(second.body.alreadyExisted).toBe(true);
      expect(second.body.document.id).toBe(id);
      // Still exactly the original chunks — no re-ingestion.
      expect(chunksFor(id)).toHaveLength(2);
      expect(app.get(InMemoryStoreService).knowledgeChunks).toHaveLength(2);
    });

    it('gives different users separate documents and chunks for same content', async () => {
      const bobToken = await login(app, 'bob@example.com', 'password');
      const alice = await upload(token, {
        filename: 'shared.txt',
        content: 'alpha\n\nbeta',
      });
      const bob = await upload(bobToken, {
        filename: 'shared.txt',
        content: 'alpha\n\nbeta',
      });

      expect(alice.body.document.id).not.toBe(bob.body.document.id);
      const aliceChunks = chunksFor(alice.body.document.id);
      const bobChunks = chunksFor(bob.body.document.id);
      expect(aliceChunks).toHaveLength(2);
      expect(bobChunks).toHaveLength(2);
      expect(aliceChunks.every((c) => c.userId === 'u1')).toBe(true);
      expect(bobChunks.every((c) => c.userId === 'u2')).toBe(true);
    });
  });

  describe('GET /knowledge/documents', () => {
    it('requires a token', async () => {
      const res = await request(app.getHttpServer()).get('/knowledge/documents');
      expect(res.status).toBe(401);
    });

    it("returns only the authenticated user's documents", async () => {
      const bobToken = await login(app, 'bob@example.com', 'password');
      await upload(token, { filename: 'alice.txt', content: 'alice doc' });
      await upload(bobToken, { filename: 'bob.txt', content: 'bob doc' });

      const res = await request(app.getHttpServer())
        .get('/knowledge/documents')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.documents).toHaveLength(1);
      expect(res.body.documents[0].fileName).toBe('alice.txt');
    });
  });

  describe('DELETE /knowledge/documents/:id', () => {
    it('requires a token', async () => {
      const res = await request(app.getHttpServer()).delete(
        '/knowledge/documents/kd-anything',
      );
      expect(res.status).toBe(401);
    });

    it("deletes the authenticated user's own document and its chunks (204)", async () => {
      const created = await upload(token, {
        filename: 'temp.txt',
        content: 'delete me\n\nsecond part',
      });
      const id = created.body.document.id as string;
      expect(chunksFor(id).length).toBeGreaterThan(0);

      const del = await request(app.getHttpServer())
        .delete(`/knowledge/documents/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(del.status).toBe(204);

      const list = await request(app.getHttpServer())
        .get('/knowledge/documents')
        .set('Authorization', `Bearer ${token}`);
      expect(list.body.documents).toHaveLength(0);
      // Chunks are gone too.
      expect(chunksFor(id)).toHaveLength(0);
    });

    it("returns 404 and keeps another user's document and chunks intact", async () => {
      const bobToken = await login(app, 'bob@example.com', 'password');
      const created = await upload(token, {
        filename: 'alice-only.txt',
        content: 'alice private\n\nand more',
      });
      const id = created.body.document.id as string;
      const originalChunkCount = chunksFor(id).length;
      expect(originalChunkCount).toBeGreaterThan(0);

      const del = await request(app.getHttpServer())
        .delete(`/knowledge/documents/${id}`)
        .set('Authorization', `Bearer ${bobToken}`);
      expect(del.status).toBe(404);
      expect(del.body.error.code).toBe('NOT_FOUND');

      // The document and its chunks still exist for their owner.
      const list = await request(app.getHttpServer())
        .get('/knowledge/documents')
        .set('Authorization', `Bearer ${token}`);
      expect(list.body.documents).toHaveLength(1);
      expect(chunksFor(id)).toHaveLength(originalChunkCount);
    });

    it('returns 404 for a non-existent document', async () => {
      const res = await request(app.getHttpServer())
        .delete('/knowledge/documents/kd-does-not-exist')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /knowledge/chunks/:chunkId (citation hydration)', () => {
    it('returns a chunk’s text (no embedding), scoped to the owner', async () => {
      const created = await upload(token, {
        filename: 'hydrate.txt',
        content: 'ec2 compute\n\ns3 storage',
      });
      const chunk = app
        .get(InMemoryStoreService)
        .knowledgeChunks.find((c) => c.documentId === created.body.document.id);
      expect(chunk).toBeDefined();
      const chunkId = chunk!.id;

      const res = await request(app.getHttpServer())
        .get(`/knowledge/chunks/${chunkId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        chunkId,
        documentId: created.body.document.id,
        documentName: 'hydrate.txt',
        chunkIndex: chunk!.chunkIndex,
        text: chunk!.text,
      });
      expect(res.body).not.toHaveProperty('embedding');
    });

    it('requires a token', async () => {
      const res = await request(app.getHttpServer()).get(
        '/knowledge/chunks/kc-anything',
      );
      expect(res.status).toBe(401);
    });

    it('returns 404 for a non-existent chunk', async () => {
      const res = await request(app.getHttpServer())
        .get('/knowledge/chunks/kc-missing')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });

    it("returns 404 for another user's chunk", async () => {
      const created = await upload(token, {
        filename: 'private.txt',
        content: 'ec2 compute',
      });
      const chunk = app
        .get(InMemoryStoreService)
        .knowledgeChunks.find((c) => c.documentId === created.body.document.id);
      const bobToken = await login(app, 'bob@example.com', 'password');

      const res = await request(app.getHttpServer())
        .get(`/knowledge/chunks/${chunk!.id}`)
        .set('Authorization', `Bearer ${bobToken}`);
      expect(res.status).toBe(404);
    });
  });
});
