import { Module } from '@nestjs/common';
import {
  StorageDriver,
  repositoryStorage,
} from '../../common/storage/storage.config';
import { KnowledgeDocumentService } from './knowledge-document.service';
import { KnowledgeDocumentRepository } from './knowledge-document.repository';
import { MongoKnowledgeDocumentRepository } from './storage/mongo-knowledge-document.repository';
import { InMemoryKnowledgeDocumentRepository } from './storage/in-memory-knowledge-document.repository';
import {
  KnowledgeDocumentDoc,
  KnowledgeDocumentSchema,
} from './storage/knowledge-document.schema';
import { KNOWLEDGE_CONNECTION } from '../knowledge-storage/knowledge-mongo-connection.module';

// ── Single change point: the documents entity's storage driver. ─────────────
export const KNOWLEDGE_DRIVER: StorageDriver = 'mongo';

// Document metadata (knowledge_documents). Registered on the dedicated Knowledge
// connection so it can live on Atlas alongside chunks.
const storage = repositoryStorage({
  driver: KNOWLEDGE_DRIVER,
  token: KnowledgeDocumentRepository,
  mongo: MongoKnowledgeDocumentRepository,
  memory: InMemoryKnowledgeDocumentRepository,
  feature: { name: KnowledgeDocumentDoc.name, schema: KnowledgeDocumentSchema },
  connectionName: KNOWLEDGE_CONNECTION,
});

@Module({
  imports: storage.imports,
  providers: [KnowledgeDocumentService, ...storage.providers],
  exports: [KnowledgeDocumentService],
})
export class KnowledgeDocumentsModule {}
