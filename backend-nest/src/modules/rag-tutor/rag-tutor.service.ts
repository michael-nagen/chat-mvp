import { Inject, Injectable } from '@nestjs/common';
import { KnowledgeRetrievalService } from './retrieval/knowledge-retrieval.service';
import { TutorAnswerGenerator } from './generation/tutor-answer-generator';
import {
  formatKnowledgeContext,
  RAG_TUTOR_FALLBACK_ANSWER,
} from './prompts/rag-tutor.prompt';
import {
  RAG_TUTOR_MIN_SCORE_TOKEN,
  RAG_TUTOR_TOP_K,
} from './config/rag-tutor.constants';
import type {
  AnswerTutorQuestionInput,
  RagTutorAnswer,
  RagTutorCitation,
  RetrievedKnowledgeChunk,
} from './rag-tutor.types';

// Orchestrates the grounded tutor answer: retrieve → keep strong chunks →
// fallback if none → otherwise generate from cited context. Depends only on the
// retrieval + generation abstractions, so the mock retrieval can later be
// swapped for real Atlas Vector Search with no change here. Embeddings never
// enter this layer.
@Injectable()
export class RagTutorService {
  constructor(
    private readonly retrieval: KnowledgeRetrievalService,
    private readonly generator: TutorAnswerGenerator,
    @Inject(RAG_TUTOR_MIN_SCORE_TOKEN) private readonly minScore: number,
  ) {}

  async answerQuestion({
    userId,
    question,
  }: AnswerTutorQuestionInput): Promise<RagTutorAnswer> {
    const retrieved = await this.retrieval.retrieve({
      userId,
      question,
      topK: RAG_TUTOR_TOP_K,
      minScore: this.minScore,
    });

    // Defensively re-apply the threshold: retrieval may not enforce minScore.
    const strong = retrieved.filter((chunk) => chunk.score >= this.minScore);

    if (strong.length === 0) {
      return { answer: RAG_TUTOR_FALLBACK_ANSWER, citations: [] };
    }

    const answer = await this.generator.generate({
      question,
      context: formatKnowledgeContext(strong),
    });

    return { answer, citations: strong.map(toCitation) };
  }
}

// For now, every strong chunk provided as context is returned as a citation —
// as a reference (chunkId + doc info + score), never the text.
const toCitation = (chunk: RetrievedKnowledgeChunk): RagTutorCitation => ({
  chunkId: chunk.chunkId,
  documentId: chunk.documentId,
  documentName: chunk.documentName,
  chunkIndex: chunk.chunkIndex,
  score: chunk.score,
});
