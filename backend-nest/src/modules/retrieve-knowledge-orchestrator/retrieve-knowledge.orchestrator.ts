import { Injectable } from '@nestjs/common';
import { KnowledgeChunkService } from '../knowledge-chunks/knowledge-chunk.service';
import { EmbeddingsProvider } from '../embeddings/embeddings-provider';
import type {
  RetrieveKnowledgeInput,
  RetrieveKnowledgeOutput,
} from './retrieve-knowledge.module';

// Retrieval policy (shared by the test endpoint now and the RAG chain in Part 6).
const TOP_K = 5;
const MIN_SCORE = 0.5;

@Injectable()
export class RetrieveKnowledgeOrchestrator {
  constructor(
    private readonly chunks: KnowledgeChunkService,
    private readonly embeddings: EmbeddingsProvider,
  ) {}

  async execute({
    userId,
    query,
  }: RetrieveKnowledgeInput): Promise<RetrieveKnowledgeOutput> {
    const embedding = await this.embeddings.embedQuery(query);
    const results = await this.chunks.search({
      userId,
      embedding,
      limit: TOP_K,
      minScore: MIN_SCORE,
    });
    return { results };
  }
}
