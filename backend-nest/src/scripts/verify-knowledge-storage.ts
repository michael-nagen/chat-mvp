import 'dotenv/config';
import mongoose, { Connection } from 'mongoose';
import { KNOWLEDGE_DOCUMENTS_COLLECTION } from '../modules/knowledge-documents/storage/knowledge-document.schema';
import { KNOWLEDGE_CHUNKS_COLLECTION } from '../modules/knowledge-chunks/storage/knowledge-chunk.schema';
import { EMBEDDING_DIMENSIONS } from '../modules/embeddings/embeddings.constants';

// Verifies the Knowledge/RAG storage split: knowledge_documents + knowledge_chunks
// (with embeddings) live on KNOWLEDGE_MONGO_URI (Atlas), while the default
// MONGO_URI holds only main app data. Read-only — never creates collections
// (countDocuments/find don't), never prints URIs/credentials. Run:
//   npm run verify:knowledge-storage
// It does NOT check API responses; that embeddings are never returned is covered
// by the retrieval/tutor e2e tests.

type ChunkSample = { embedding?: unknown };
type DocumentSample = {
  fileName?: unknown;
  userId?: unknown;
  chunkCount?: unknown;
  contentHash?: unknown;
};

const count = (connection: Connection, name: string): Promise<number> =>
  connection.collection(name).countDocuments();

const latest = <T>(connection: Connection, name: string): Promise<T | null> =>
  connection
    .collection(name)
    .find()
    .sort({ createdAt: -1 })
    .limit(1)
    .next() as Promise<T | null>;

async function main(): Promise<void> {
  const mainUri = process.env.MONGO_URI;
  const knowledgeUri = process.env.KNOWLEDGE_MONGO_URI ?? mainUri;
  if (!knowledgeUri) {
    console.log('Neither KNOWLEDGE_MONGO_URI nor MONGO_URI is set — skipping.');
    return;
  }
  // Dedicated only when a distinct KNOWLEDGE_MONGO_URI is configured.
  const dedicated =
    Boolean(process.env.KNOWLEDGE_MONGO_URI) &&
    process.env.KNOWLEDGE_MONGO_URI !== mainUri;

  const mainConn = mainUri
    ? await mongoose.createConnection(mainUri).asPromise()
    : undefined;
  const knowledgeConn = await mongoose.createConnection(knowledgeUri).asPromise();

  const failures: string[] = [];
  const warnings: string[] = [];

  try {
    const defaultDocs = mainConn
      ? await count(mainConn, KNOWLEDGE_DOCUMENTS_COLLECTION)
      : 0;
    const defaultChunks = mainConn
      ? await count(mainConn, KNOWLEDGE_CHUNKS_COLLECTION)
      : 0;
    const knowledgeDocs = await count(knowledgeConn, KNOWLEDGE_DOCUMENTS_COLLECTION);
    const knowledgeChunks = await count(knowledgeConn, KNOWLEDGE_CHUNKS_COLLECTION);

    console.log('Knowledge Storage Verification\n');
    console.log('Default DB:');
    console.log(`  database: ${mainConn ? mainConn.name : '(MONGO_URI not set)'}`);
    console.log(`  knowledge_documents: ${defaultDocs}`);
    console.log(`  knowledge_chunks: ${defaultChunks}\n`);
    console.log('Knowledge DB:');
    console.log(`  database: ${knowledgeConn.name}`);
    console.log(`  knowledge_documents: ${knowledgeDocs}`);
    console.log(`  knowledge_chunks: ${knowledgeChunks}`);

    let embeddingLength: number | undefined;
    if (knowledgeChunks > 0) {
      const chunk = await latest<ChunkSample>(
        knowledgeConn,
        KNOWLEDGE_CHUNKS_COLLECTION,
      );
      const embedding = chunk?.embedding;
      embeddingLength = Array.isArray(embedding) ? embedding.length : undefined;
      console.log(
        `  latest chunk embedding length: ${embeddingLength ?? 'MISSING'}`,
      );
    }
    if (knowledgeDocs > 0) {
      const doc = await latest<DocumentSample>(
        knowledgeConn,
        KNOWLEDGE_DOCUMENTS_COLLECTION,
      );
      console.log(
        `  latest document: ${String(doc?.fileName)} ` +
          `(userId=${String(doc?.userId)}, chunkCount=${String(doc?.chunkCount)}, ` +
          `contentHash present=${Boolean(doc?.contentHash)})`,
      );
    }

    // ── Evaluate ────────────────────────────────────────────────────────────
    if (!dedicated) {
      warnings.push(
        'KNOWLEDGE_MONGO_URI is not set (or equals MONGO_URI): Knowledge data ' +
          'shares the default connection, so the split cannot be verified. Set a ' +
          'dedicated Atlas KNOWLEDGE_MONGO_URI.',
      );
    }
    if (knowledgeChunks > 0 && embeddingLength === undefined) {
      failures.push('Latest knowledge chunk has no embedding array.');
    }
    if (
      knowledgeChunks > 0 &&
      embeddingLength !== undefined &&
      embeddingLength !== EMBEDDING_DIMENSIONS
    ) {
      failures.push(
        `Latest chunk embedding length ${embeddingLength} != ${EMBEDDING_DIMENSIONS} ` +
          '(expected for OpenAI text-embedding-3-small).',
      );
    }
    if (dedicated && (defaultDocs > 0 || defaultChunks > 0)) {
      warnings.push(
        `Default DB contains knowledge_documents (${defaultDocs}) / ` +
          `knowledge_chunks (${defaultChunks}). These may be stale from before the ` +
          'Atlas split; new uploads write to Atlas.',
      );
    }
    if (knowledgeDocs === 0 && knowledgeChunks === 0) {
      warnings.push(
        'No Knowledge data found in the Knowledge DB yet. Upload a document, then ' +
          're-run to verify it landed in Atlas.',
      );
    }

    console.log('');
    if (warnings.length > 0) {
      console.log('WARNING:');
      for (const w of warnings) console.log(`  ${w}`);
      console.log('');
    }
    if (failures.length === 0) {
      console.log('PASS:');
      if (knowledgeDocs > 0) console.log('  Knowledge documents are stored in Atlas.');
      if (knowledgeChunks > 0) {
        console.log('  Knowledge chunks are stored in Atlas.');
        console.log('  Embeddings are stored in Atlas.');
      }
      if (dedicated) {
        console.log('  Default DB is not receiving new Knowledge/RAG data.');
      }
    } else {
      console.log('FAIL:');
      for (const f of failures) console.log(`  ${f}`);
    }
  } finally {
    await knowledgeConn.close();
    if (mainConn) await mainConn.close();
  }

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
