import { RagTutorService } from './rag-tutor.service';
import { KnowledgeRetrievalService } from './retrieval/knowledge-retrieval.service';
import { MockKnowledgeRetrievalService } from './retrieval/mock-knowledge-retrieval.service';
import { FakeTutorAnswerGenerator } from './generation/fake-tutor-answer-generator';
import { RAG_TUTOR_FALLBACK_ANSWER } from './prompts/rag-tutor.prompt';
import { RAG_TUTOR_MIN_SCORE } from './config/rag-tutor.constants';
import type {
  RetrievedKnowledgeChunk,
  RetrieveKnowledgeChunksInput,
} from './rag-tutor.types';

// Retrieval stub returning exactly what a test wants, to exercise the service's
// filtering/fallback independent of the mock's canned data.
class StubRetrieval extends KnowledgeRetrievalService {
  constructor(private readonly chunks: RetrievedKnowledgeChunk[]) {
    super();
  }
  retrieve(_input: RetrieveKnowledgeChunksInput): Promise<RetrievedKnowledgeChunk[]> {
    return Promise.resolve(this.chunks);
  }
}

const generator = new FakeTutorAnswerGenerator();

const makeService = (
  retrieval: KnowledgeRetrievalService,
  minScore = RAG_TUTOR_MIN_SCORE,
): RagTutorService => new RagTutorService(retrieval, generator, minScore);

const chunk = (
  overrides: Partial<RetrievedKnowledgeChunk> & { score: number },
): RetrievedKnowledgeChunk => ({
  chunkId: 'kc-1',
  documentId: 'd1',
  documentName: 'x.md',
  chunkIndex: 0,
  text: 'some text',
  ...overrides,
});

describe('RagTutorService', () => {
  it('returns a grounded answer + citations from strong chunks (mock retrieval)', async () => {
    const service = makeService(new MockKnowledgeRetrievalService());

    const result = await service.answerQuestion({
      userId: 'u1',
      question: 'What is RAG?',
    });

    expect(result.answer.length).toBeGreaterThan(0);
    expect(result.citations).toEqual([
      { chunkId: 'mock-chunk-0', documentId: 'mock-doc-1', documentName: 'mock-rag-intro.md', chunkIndex: 0, score: 0.82 },
      { chunkId: 'mock-chunk-1', documentId: 'mock-doc-1', documentName: 'mock-rag-intro.md', chunkIndex: 1, score: 0.76 },
    ]);
    // Citations are refs only — never embeddings or chunk text.
    for (const citation of result.citations) {
      expect(Object.keys(citation).sort()).toEqual([
        'chunkId',
        'chunkIndex',
        'documentId',
        'documentName',
        'score',
      ]);
    }
  });

  it('returns the safe fallback with no citations when retrieval is empty', async () => {
    const service = makeService(new MockKnowledgeRetrievalService());

    const result = await service.answerQuestion({
      userId: 'u1',
      question: 'no-context please',
    });

    expect(result.answer).toBe(RAG_TUTOR_FALLBACK_ANSWER);
    expect(result.citations).toEqual([]);
  });

  it('treats below-threshold (weak) chunks as no strong context', async () => {
    const service = makeService(new StubRetrieval([chunk({ score: 0.3 })]));

    const result = await service.answerQuestion({
      userId: 'u1',
      question: 'anything',
    });

    expect(result.answer).toBe(RAG_TUTOR_FALLBACK_ANSWER);
    expect(result.citations).toEqual([]);
  });

  // Regression for the tuning fix: an unrelated question against a small corpus
  // can still score ~0.58 (above the old 0.5) — with the 0.65 default it must
  // fall back instead of citing an off-topic chunk.
  it('falls back for a chunk that would have passed the old 0.5 threshold', async () => {
    const service = makeService(new StubRetrieval([chunk({ score: 0.58 })]));

    const result = await service.answerQuestion({
      userId: 'u1',
      question: 'What is the refund policy?',
    });

    expect(result.answer).toBe(RAG_TUTOR_FALLBACK_ANSWER);
    expect(result.citations).toEqual([]);
  });

  it('honours a configured minScore', async () => {
    const service = makeService(new StubRetrieval([chunk({ score: 0.82 })]), 0.9);

    const result = await service.answerQuestion({
      userId: 'u1',
      question: 'anything',
    });

    expect(result.answer).toBe(RAG_TUTOR_FALLBACK_ANSWER);
    expect(result.citations).toEqual([]);
  });
});
