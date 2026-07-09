import { Injectable } from '@nestjs/common';
import { KnowledgeChunkService } from '../knowledge-chunks/knowledge-chunk.service';
import { NotFoundException } from '../../common/errors/app.exception';
import type { GetKnowledgeChunkInput, GetKnowledgeChunkOutput } from './get-knowledge-chunk.module';

// Hydrates a citation's source text from Atlas by chunkId, scoped to the owner.
// Returns identifying fields + text only — the embedding never leaves storage.
@Injectable()
export class GetKnowledgeChunkOrchestrator {
  constructor(private readonly chunks: KnowledgeChunkService) {}

  async execute({
    userId,
    chunkId,
  }: GetKnowledgeChunkInput): Promise<GetKnowledgeChunkOutput> {
    const chunk = await this.chunks.findByIdForUser({ chunkId, userId });
    if (!chunk) {
      // Missing or owned by someone else — 404 either way (no existence leak).
      throw new NotFoundException('Knowledge chunk not found.');
    }
    return {
      chunkId: chunk.id,
      documentId: chunk.documentId,
      documentName: chunk.documentName,
      chunkIndex: chunk.chunkIndex,
      text: chunk.text,
    };
  }
}
