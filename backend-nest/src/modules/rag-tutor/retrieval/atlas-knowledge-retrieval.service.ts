import { Injectable } from '@nestjs/common';
import { KnowledgeRetrievalService } from './knowledge-retrieval.service';
import { RAG_TUTOR_MIN_SCORE, RAG_TUTOR_TOP_K } from '../config/rag-tutor.constants';
import {
  RetrievedKnowledgeChunk,
  RetrieveKnowledgeChunksInput,
} from '../rag-tutor.types';
import { KnowledgeChunkService } from '../../knowledge-chunks/knowledge-chunk.service';
import { EmbeddingsProvider } from '../../embeddings/embeddings-provider';

// Real retrieval: embeds the question and runs Atlas Vector Search over
// knowledge_chunks (Part 5), scoped to the authenticated user. Reuses the
// existing embeddings provider + knowledge-chunks search — no vector-search
// logic is duplicated here. Embeddings are never returned (search already
// projects them away).
@Injectable()
export class AtlasKnowledgeRetrievalService extends KnowledgeRetrievalService {
  constructor(
    private readonly chunks: KnowledgeChunkService,
    private readonly embeddings: EmbeddingsProvider,
  ) {
    super();
  }

  async retrieve({
    userId,
    question,
    topK,
    minScore,
  }: RetrieveKnowledgeChunksInput): Promise<RetrievedKnowledgeChunk[]> {
    const embedding = await this.embeddings.embedQuery(question);
    const matches = await this.chunks.search({
      userId,
      embedding,
      limit: topK ?? RAG_TUTOR_TOP_K,
      minScore: minScore ?? RAG_TUTOR_MIN_SCORE,
    });
    return matches.map((match) => ({
      chunkId: match.chunkId,
      documentId: match.documentId,
      documentName: match.documentName,
      chunkIndex: match.chunkIndex,
      text: match.text,
      score: match.score,
    }));
  }
}
