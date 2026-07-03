import { Injectable } from '@nestjs/common';
import { KnowledgeDocumentService } from '../knowledge-documents/knowledge-document.service';
import { KnowledgeChunkService } from '../knowledge-chunks/knowledge-chunk.service';
import { UnitOfWork } from '../../common/storage/unit-of-work';
import { NotFoundException } from '../../common/errors/app.exception';
import type { DeleteKnowledgeDocumentInput } from './delete-knowledge-document.module';

@Injectable()
export class DeleteKnowledgeDocumentOrchestrator {
  constructor(
    private readonly documents: KnowledgeDocumentService,
    private readonly chunks: KnowledgeChunkService,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute({ userId, id }: DeleteKnowledgeDocumentInput): Promise<void> {
    await this.unitOfWork.run(async (tx) => {
      await this.chunks.deleteForDocument({ userId, documentId: id }, tx);
      const deleted = await this.documents.deleteForUser({ id, userId }, tx);
      if (!deleted) {
        throw new NotFoundException('Knowledge document not found.');
      }
    });
  }
}
