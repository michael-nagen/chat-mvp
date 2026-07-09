import { Module } from '@nestjs/common';
import { KnowledgeDocumentsModule } from '../knowledge-documents/knowledge-documents.module';
import { KnowledgeDocumentResponse } from '../knowledge-documents/knowledge-document.types';
import { ListKnowledgeDocumentsOrchestrator } from './list-knowledge-documents.orchestrator';

export interface ListKnowledgeDocumentsInput {
  userId: string;
}

export interface ListKnowledgeDocumentsOutput {
  documents: KnowledgeDocumentResponse[];
}

@Module({
  imports: [KnowledgeDocumentsModule],
  providers: [ListKnowledgeDocumentsOrchestrator],
  exports: [ListKnowledgeDocumentsOrchestrator],
})
export class ListKnowledgeDocumentsModule {}
