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
import {
  KnowledgeDocumentResponse,
  UploadedFileLike,
} from '../knowledge-documents/knowledge-document.types';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { MessagesModule } from '../messages/messages.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { unitOfWorkProvider } from '../../common/storage/storage.config';
import { UploadKnowledgeDocumentOrchestrator } from './upload-knowledge-document.orchestrator';

export interface UploadKnowledgeDocumentInput {
  userId: string;
  file?: UploadedFileLike;
  // Optional: when a tutor conversation is provided, an upload event message is
  // posted into it (UI event only).
  conversationId?: string;
}

export interface UploadKnowledgeDocumentOutput {
  document: KnowledgeDocumentResponse;
  // True when identical content was already uploaded by this user (idempotent).
  alreadyExisted: boolean;
}

@Module({
  imports: [
    KnowledgeDocumentsModule,
    KnowledgeChunksModule,
    EmbeddingsModule,
    MessagesModule,
    ConversationsModule,
  ],
  providers: [
    UploadKnowledgeDocumentOrchestrator,
    unitOfWorkProvider(
      [KNOWLEDGE_DRIVER, KNOWLEDGE_CHUNKS_DRIVER],
      KNOWLEDGE_CONNECTION,
    ),
  ],
  exports: [UploadKnowledgeDocumentOrchestrator],
})
export class UploadKnowledgeDocumentModule {}
