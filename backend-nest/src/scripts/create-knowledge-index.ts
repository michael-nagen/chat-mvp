import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { KnowledgeChunkRepository } from '../modules/knowledge-chunks/knowledge-chunk.repository';

// One-off ops script: creates the Atlas Vector Search index on knowledge_chunks
// (1536-dim cosine, userId + documentId filters). Run once against the Knowledge
// Atlas cluster after deploying Part 5:
//   npm run create:knowledge-index
// It is intentionally NOT run on app boot (createSearchIndex is Atlas-only and
// errors on standalone Mongo). Requires the knowledge driver to be mongo and
// KNOWLEDGE_MONGO_URI (or MONGO_URI fallback) to point at Atlas.
async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  try {
    await app.get(KnowledgeChunkRepository).createVectorSearchIndex();
    console.log('Knowledge vector search index is ready.');
  } finally {
    await app.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
