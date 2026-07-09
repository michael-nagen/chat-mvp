import { Module } from '@nestjs/common';
import {
  KnowledgeDocumentsModule,
  KNOWLEDGE_DRIVER,
} from '../knowledge-documents/knowledge-documents.module';
import {
  KnowledgeChunksModule,
  KNOWLEDGE_CHUNKS_DRIVER,
} from '../knowledge-chunks/knowledge-chunks.module';
import { KNOWLEDGE_CONNECTION } from '../knowledge-storage/knowledge-mongo-connection.module';
import { unitOfWorkProvider } from '../../common/storage/storage.config';
import { DeleteKnowledgeDocumentOrchestrator } from './delete-knowledge-document.orchestrator';

export interface DeleteKnowledgeDocumentInput {
  userId: string;
  id: string;
}

@Module({
  imports: [KnowledgeDocumentsModule, KnowledgeChunksModule],
  providers: [
    DeleteKnowledgeDocumentOrchestrator,
    unitOfWorkProvider(
      [KNOWLEDGE_DRIVER, KNOWLEDGE_CHUNKS_DRIVER],
      KNOWLEDGE_CONNECTION,
    ),
  ],
  exports: [DeleteKnowledgeDocumentOrchestrator],
})
export class DeleteKnowledgeDocumentModule {}
