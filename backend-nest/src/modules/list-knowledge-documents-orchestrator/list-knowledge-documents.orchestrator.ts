import { Injectable } from '@nestjs/common';
import { KnowledgeDocumentService } from '../knowledge-documents/knowledge-document.service';
import { toKnowledgeDocumentResponse } from '../knowledge-documents/knowledge-document.mapper';
import type {
  ListKnowledgeDocumentsInput,
  ListKnowledgeDocumentsOutput,
} from './list-knowledge-documents.module';

@Injectable()
export class ListKnowledgeDocumentsOrchestrator {
  constructor(private readonly documents: KnowledgeDocumentService) {}

  async execute({
    userId,
  }: ListKnowledgeDocumentsInput): Promise<ListKnowledgeDocumentsOutput> {
    const documents = await this.documents.getForUser(userId);
    return { documents: documents.map(toKnowledgeDocumentResponse) };
  }
}
