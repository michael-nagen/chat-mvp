import { Module } from '@nestjs/common';
import {
  StorageDriver,
  repositoryStorage,
} from '../../common/storage/storage.config';
import { KnowledgeChunkService } from './knowledge-chunk.service';
import { KnowledgeChunkRepository } from './knowledge-chunk.repository';
import { MongoKnowledgeChunkRepository } from './storage/mongo-knowledge-chunk.repository';
import { InMemoryKnowledgeChunkRepository } from './storage/in-memory-knowledge-chunk.repository';
import {
  KnowledgeChunkDoc,
  KnowledgeChunkSchema,
} from './storage/knowledge-chunk.schema';
import { KNOWLEDGE_CONNECTION } from '../knowledge-storage/knowledge-mongo-connection.module';

// ── Single change point: the chunks entity's storage driver. ────────────────
export const KNOWLEDGE_CHUNKS_DRIVER: StorageDriver = 'mongo';

// Chunk storage (knowledge_chunks) on the dedicated Knowledge connection. Part 5
// will add the embedding field + Atlas Vector Search index here only.
const storage = repositoryStorage({
  driver: KNOWLEDGE_CHUNKS_DRIVER,
  token: KnowledgeChunkRepository,
  mongo: MongoKnowledgeChunkRepository,
  memory: InMemoryKnowledgeChunkRepository,
  feature: { name: KnowledgeChunkDoc.name, schema: KnowledgeChunkSchema },
  connectionName: KNOWLEDGE_CONNECTION,
});

@Module({
  imports: storage.imports,
  providers: [KnowledgeChunkService, ...storage.providers],
  exports: [KnowledgeChunkService],
})
export class KnowledgeChunksModule {}
