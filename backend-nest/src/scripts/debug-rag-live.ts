import 'reflect-metadata';
import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import mongoose, { Connection } from 'mongoose';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { KnowledgeRetrievalService } from '../modules/rag-tutor/retrieval/knowledge-retrieval.service';
import { AtlasKnowledgeRetrievalService } from '../modules/rag-tutor/retrieval/atlas-knowledge-retrieval.service';
import { RagTutorService } from '../modules/rag-tutor/rag-tutor.service';
import { UploadKnowledgeDocumentOrchestrator } from '../modules/upload-knowledge-document-orchestrator/upload-knowledge-document.orchestrator';
import { UploadedFileLike } from '../modules/knowledge-documents/knowledge-document.types';
import {
  RAG_RETRIEVAL_PROVIDER_ENV,
  RAG_TUTOR_PROVIDER_ENV,
  resolveRagRetrievalProvider,
  resolveRagTutorProvider,
} from '../modules/rag-tutor/config/rag-tutor.constants';
import {
  EMBEDDINGS_PROVIDER_ENV,
  EMBEDDING_DIMENSIONS,
  resolveEmbeddingsProvider,
} from '../modules/embeddings/embeddings.constants';
import { KNOWLEDGE_DOCUMENTS_COLLECTION } from '../modules/knowledge-documents/storage/knowledge-document.schema';
import { KNOWLEDGE_CHUNKS_COLLECTION } from '../modules/knowledge-chunks/storage/knowledge-chunk.schema';
import { RAG_TUTOR_FALLBACK_ANSWER } from '../modules/rag-tutor/prompts/rag-tutor.prompt';

// Opt-in end-to-end proof that the REAL (non-mock) RAG path works against Atlas
// + OpenAI. Unlike the eval runner, it does NOT force RAG_RETRIEVAL_PROVIDER —
// it reads the real .env and fails loudly if the live retrieval service is the
// mock, so a mis-set dev env is caught instead of silently passing. Never part
// of CI. Run:  npm run debug:rag-live
// Requires: RAG_RETRIEVAL_PROVIDER=atlas, KNOWLEDGE_MONGO_URI, OPENAI_API_KEY,
// and the Atlas Vector Search index on knowledge_chunks (npm run create:knowledge-index).

const DEBUG_USER_ID = 'rag-debug-user';
const KNOWN_QUESTION = 'What is RAG?';
const UNKNOWN_QUESTION = 'What is the refund policy?';

type Check = { name: string; ok: boolean; detail: string };

async function main(): Promise<void> {
  const checks: Check[] = [];
  const record = (name: string, ok: boolean, detail: string): boolean => {
    checks.push({ name, ok, detail });
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} — ${detail}`);
    return ok;
  };

  // ── 1. Env provider values (no secrets) ──────────────────────────────────
  const retrievalProvider = resolveRagRetrievalProvider(
    process.env[RAG_RETRIEVAL_PROVIDER_ENV],
  );
  const tutorProvider = resolveRagTutorProvider(
    process.env[RAG_TUTOR_PROVIDER_ENV],
  );
  const embeddingsProvider = resolveEmbeddingsProvider(
    process.env[EMBEDDINGS_PROVIDER_ENV],
  );
  const knowledgeUri = process.env.KNOWLEDGE_MONGO_URI;

  console.log('RAG live debug — resolved provider config:');
  console.log(`  RAG retrieval provider: ${retrievalProvider}`);
  console.log(`  RAG tutor generator: ${tutorProvider}`);
  console.log(`  Embeddings provider: ${embeddingsProvider}`);
  console.log(`  Knowledge Mongo configured: ${knowledgeUri ? 'yes' : 'no'}\n`);

  // Hard preconditions: this command is meaningless on the mock path.
  if (
    !record(
      'env: retrieval provider is atlas',
      retrievalProvider === 'atlas',
      `RAG_RETRIEVAL_PROVIDER resolves to "${retrievalProvider}" (must be "atlas")`,
    ) ||
    !record(
      'env: KNOWLEDGE_MONGO_URI is set',
      Boolean(knowledgeUri),
      knowledgeUri ? 'present' : 'missing',
    ) ||
    !record(
      'env: OPENAI_API_KEY is set',
      Boolean(process.env.OPENAI_API_KEY),
      process.env.OPENAI_API_KEY ? 'present' : 'missing',
    )
  ) {
    return finish(checks);
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  let knowledgeConn: Connection | undefined;

  try {
    // ── 2. Active retrieval provider is really Atlas ────────────────────────
    const retrieval = app.get(KnowledgeRetrievalService, { strict: false });
    record(
      'runtime: live retrieval service is Atlas',
      retrieval instanceof AtlasKnowledgeRetrievalService,
      `resolved ${retrieval.constructor.name} (must be AtlasKnowledgeRetrievalService)`,
    );

    // ── 3. Upload a real test document (real embeddings) ────────────────────
    const upload = app.get(UploadKnowledgeDocumentOrchestrator, {
      strict: false,
    });
    const buffer = readFileSync(join(__dirname, '../eval/rag/rag-test.md'));
    const file: UploadedFileLike = {
      originalname: 'rag-test.md',
      buffer,
      size: buffer.length,
      mimetype: 'text/markdown',
    };
    const uploaded = await upload.execute({ userId: DEBUG_USER_ID, file });
    record(
      'upload: test document ingested',
      uploaded.document.chunkCount > 0,
      `${uploaded.document.fileName} — ${uploaded.document.chunkCount} chunks ` +
        `(${uploaded.alreadyExisted ? 'already present' : 'newly uploaded'})`,
    );

    // ── 4-6. Document + chunks + embeddings landed in Atlas ─────────────────
    knowledgeConn = await mongoose
      .createConnection(knowledgeUri as string)
      .asPromise();
    const doc = await knowledgeConn
      .collection(KNOWLEDGE_DOCUMENTS_COLLECTION)
      .findOne({ userId: DEBUG_USER_ID, fileName: 'rag-test.md' });
    record(
      'atlas: document row exists in knowledge_documents',
      Boolean(doc),
      doc ? `_id=${String(doc._id)}` : 'not found',
    );

    const chunk = doc
      ? await knowledgeConn
          .collection(KNOWLEDGE_CHUNKS_COLLECTION)
          .findOne({ documentId: String(doc._id) })
      : null;
    record(
      'atlas: chunk rows exist in knowledge_chunks',
      Boolean(chunk),
      chunk ? `sample chunkIndex=${String(chunk.chunkIndex)}` : 'not found',
    );

    const embeddingLength = Array.isArray(chunk?.embedding)
      ? (chunk!.embedding as number[]).length
      : undefined;
    record(
      `atlas: chunk embedding has length ${EMBEDDING_DIMENSIONS}`,
      embeddingLength === EMBEDDING_DIMENSIONS,
      `length=${embeddingLength ?? 'MISSING'}`,
    );

    // ── 7. Retrieval returns the uploaded document, not the mock ────────────
    const retrieved = await retrieval.retrieve({
      userId: DEBUG_USER_ID,
      question: KNOWN_QUESTION,
    });
    const sources = retrieved.map((c) => c.documentName);
    record(
      'retrieval: known question returns the uploaded document',
      retrieved.some((c) => c.documentName.includes('rag-test')) &&
        !sources.includes('mock-rag-intro.md'),
      `sources=[${sources.join(', ') || 'none'}]`,
    );
    record(
      'retrieval: chunks carry no embedding field',
      retrieved.every((c) => !('embedding' in c)),
      `${retrieved.length} chunks checked`,
    );

    // ── 8. Tutor answer citations use the uploaded document ─────────────────
    const tutor = app.get(RagTutorService, { strict: false });
    const answer = await tutor.answerQuestion({
      userId: DEBUG_USER_ID,
      question: KNOWN_QUESTION,
    });
    record(
      'tutor: citations reference the uploaded document',
      answer.citations.length > 0 &&
        answer.citations.every((c) => c.documentName?.includes('rag-test')),
      `citations=[${answer.citations.map((c) => c.documentName).join(', ') || 'none'}]`,
    );
    record(
      'tutor: citations expose no chunk text or embeddings',
      answer.citations.every(
        (c) => !('text' in c) && !('embedding' in c),
      ),
      'citations are reference-only',
    );

    // ── 9. Unknown question → fallback with no sources ──────────────────────
    const fallback = await tutor.answerQuestion({
      userId: DEBUG_USER_ID,
      question: UNKNOWN_QUESTION,
    });
    record(
      'tutor: unknown question returns fallback with no Sources',
      fallback.citations.length === 0 &&
        fallback.answer === RAG_TUTOR_FALLBACK_ANSWER,
      `citations=${fallback.citations.length}`,
    );
  } finally {
    if (knowledgeConn) await knowledgeConn.close();
    await app.close();
  }

  finish(checks);
}

function finish(checks: Check[]): void {
  const failed = checks.filter((c) => !c.ok);
  console.log(
    `\n${failed.length === 0 ? 'ALL CHECKS PASSED' : `${failed.length} CHECK(S) FAILED`}` +
      ` (${checks.length - failed.length}/${checks.length})`,
  );
  if (failed.length > 0) {
    for (const c of failed) console.log(`  FAIL ${c.name}: ${c.detail}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
