import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RagTutorService } from './rag-tutor.service';
import { KnowledgeRetrievalService } from './retrieval/knowledge-retrieval.service';
import { MockKnowledgeRetrievalService } from './retrieval/mock-knowledge-retrieval.service';
import { AtlasKnowledgeRetrievalService } from './retrieval/atlas-knowledge-retrieval.service';
import { TutorAnswerGenerator } from './generation/tutor-answer-generator';
import { LangChainTutorAnswerGenerator } from './generation/langchain-tutor-answer-generator';
import { FakeTutorAnswerGenerator } from './generation/fake-tutor-answer-generator';
import {
  RAG_RETRIEVAL_PROVIDER_ENV,
  RAG_TUTOR_MIN_SCORE_ENV,
  RAG_TUTOR_MIN_SCORE_TOKEN,
  RAG_TUTOR_PROVIDER_ENV,
  resolveRagRetrievalProvider,
  resolveRagTutorMinScore,
  resolveRagTutorProvider,
} from './config/rag-tutor.constants';
import { KnowledgeChunksModule } from '../knowledge-chunks/knowledge-chunks.module';
import { KnowledgeChunkService } from '../knowledge-chunks/knowledge-chunk.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { EmbeddingsProvider } from '../embeddings/embeddings-provider';

// Selects the retrieval implementation from RAG_RETRIEVAL_PROVIDER: 'atlas'
// (real Atlas Vector Search via knowledge-chunks) or 'mock' (default; offline
// canned chunks so tests never hit the network). Exported so the wiring itself
// is unit-testable without booting the Mongo-backed modules.
export function selectKnowledgeRetrievalService(
  config: ConfigService,
  chunks: KnowledgeChunkService,
  embeddings: EmbeddingsProvider,
): KnowledgeRetrievalService {
  const provider = resolveRagRetrievalProvider(
    config.get<string>(RAG_RETRIEVAL_PROVIDER_ENV),
  );
  if (provider === 'atlas' && !config.get<string>('KNOWLEDGE_MONGO_URI')) {
    // Fail loudly rather than let the knowledge connection silently fall back to
    // MONGO_URI and write chunks into the chat DB.
    throw new Error(
      'RAG_RETRIEVAL_PROVIDER=atlas requires KNOWLEDGE_MONGO_URI to be set. ' +
        'Set it in backend-nest/.env, or use RAG_RETRIEVAL_PROVIDER=mock.',
    );
  }
  return provider === 'atlas'
    ? new AtlasKnowledgeRetrievalService(chunks, embeddings)
    : new MockKnowledgeRetrievalService();
}

// Selects the answer generator from RAG_TUTOR_PROVIDER: LangChain OpenAI
// (default) or the deterministic fake (tests).
export function selectTutorAnswerGenerator(
  config: ConfigService,
): TutorAnswerGenerator {
  return resolveRagTutorProvider(config.get<string>(RAG_TUTOR_PROVIDER_ENV)) ===
    'fake'
    ? new FakeTutorAnswerGenerator()
    : new LangChainTutorAnswerGenerator(config);
}

// Wires the RAG tutor. RagTutorService is unaware of which retrieval/generation
// implementation it got — both sides are chosen by the selectors above.
@Module({
  imports: [KnowledgeChunksModule, EmbeddingsModule],
  providers: [
    RagTutorService,
    {
      provide: RAG_TUTOR_MIN_SCORE_TOKEN,
      inject: [ConfigService],
      useFactory: (config: ConfigService): number =>
        resolveRagTutorMinScore(config.get<string>(RAG_TUTOR_MIN_SCORE_ENV)),
    },
    {
      provide: KnowledgeRetrievalService,
      inject: [ConfigService, KnowledgeChunkService, EmbeddingsProvider],
      useFactory: selectKnowledgeRetrievalService,
    },
    {
      provide: TutorAnswerGenerator,
      inject: [ConfigService],
      useFactory: selectTutorAnswerGenerator,
    },
  ],
  exports: [RagTutorService, KnowledgeRetrievalService],
})
export class RagTutorModule {}
