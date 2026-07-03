import { ConfigService } from '@nestjs/config';
import {
  selectKnowledgeRetrievalService,
  selectTutorAnswerGenerator,
} from './rag-tutor.module';
import { AtlasKnowledgeRetrievalService } from './retrieval/atlas-knowledge-retrieval.service';
import { MockKnowledgeRetrievalService } from './retrieval/mock-knowledge-retrieval.service';
import { LangChainTutorAnswerGenerator } from './generation/langchain-tutor-answer-generator';
import { FakeTutorAnswerGenerator } from './generation/fake-tutor-answer-generator';
import { KnowledgeChunkService } from '../knowledge-chunks/knowledge-chunk.service';
import { EmbeddingsProvider } from '../embeddings/embeddings-provider';

// A ConfigService backed by a plain map — no real env / DI container needed.
const configOf = (env: Record<string, string>): ConfigService =>
  ({ get: (key: string) => env[key] }) as unknown as ConfigService;

const chunks = {} as KnowledgeChunkService;
const embeddings = {} as EmbeddingsProvider;

describe('selectKnowledgeRetrievalService', () => {
  it('selects AtlasKnowledgeRetrievalService when RAG_RETRIEVAL_PROVIDER=atlas', () => {
    const service = selectKnowledgeRetrievalService(
      configOf({ RAG_RETRIEVAL_PROVIDER: 'atlas', KNOWLEDGE_MONGO_URI: 'mongodb://x' }),
      chunks,
      embeddings,
    );
    expect(service).toBeInstanceOf(AtlasKnowledgeRetrievalService);
  });

  it('selects MockKnowledgeRetrievalService when RAG_RETRIEVAL_PROVIDER=mock', () => {
    const service = selectKnowledgeRetrievalService(
      configOf({ RAG_RETRIEVAL_PROVIDER: 'mock' }),
      chunks,
      embeddings,
    );
    expect(service).toBeInstanceOf(MockKnowledgeRetrievalService);
  });

  it('defaults to Mock when the provider is unset (offline-safe default)', () => {
    const service = selectKnowledgeRetrievalService(configOf({}), chunks, embeddings);
    expect(service).toBeInstanceOf(MockKnowledgeRetrievalService);
  });

  it('fails loudly for atlas without KNOWLEDGE_MONGO_URI instead of silently degrading', () => {
    expect(() =>
      selectKnowledgeRetrievalService(
        configOf({ RAG_RETRIEVAL_PROVIDER: 'atlas' }),
        chunks,
        embeddings,
      ),
    ).toThrow(/KNOWLEDGE_MONGO_URI/);
  });
});

describe('selectTutorAnswerGenerator', () => {
  it('selects the fake generator when RAG_TUTOR_PROVIDER=fake', () => {
    expect(selectTutorAnswerGenerator(configOf({ RAG_TUTOR_PROVIDER: 'fake' }))).toBeInstanceOf(
      FakeTutorAnswerGenerator,
    );
  });

  it('selects the LangChain generator by default', () => {
    // The model is built lazily, so no key is needed just to construct it.
    expect(selectTutorAnswerGenerator(configOf({}))).toBeInstanceOf(
      LangChainTutorAnswerGenerator,
    );
  });
});
