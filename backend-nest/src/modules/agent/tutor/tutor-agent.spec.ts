import { AgentService } from '../agent.service';
import { LlmProvider } from '../../ai-provider/llm-provider';
import type { ProviderTurnEvent } from '../../ai-provider/ai-provider.types';
import { AssistantRegistry } from '../../assistant/assistant.registry';
import { ToolRegistry } from '../../assistant-tools/tool-registry/tool-registry';
import { ToolExecutor } from '../../assistant-tools/tool-executor/tool-executor';
import { KnowledgeRetrievalService } from '../../rag-tutor/retrieval/knowledge-retrieval.service';
import { FakeTutorAnswerGenerator } from '../../rag-tutor/generation/fake-tutor-answer-generator';
import { RAG_TUTOR_FALLBACK_ANSWER } from '../../rag-tutor/prompts/rag-tutor.prompt';
import { RAG_TUTOR_MIN_SCORE } from '../../rag-tutor/config/rag-tutor.constants';
import { GraphCheckpointer } from '../checkpoint/checkpoint.provider';
import type {
  RetrievedKnowledgeChunk,
  RetrieveKnowledgeChunksInput,
} from '../../rag-tutor/rag-tutor.types';
import type { TutorAgentEvent } from './tutor-agent.types';
import type { RagTutorCitation } from '../../rag-tutor/rag-tutor.types';

// The tutor path never touches the LLM provider or tools.
class IdleLlmProvider extends LlmProvider {
  complete(): Promise<string> {
    return Promise.resolve('');
  }
  async *streamTurn(): AsyncIterable<ProviderTurnEvent> {
    yield* [];
  }
}

// Records the retrieval input so the trusted-userId invariant is testable and
// returns whatever chunks the test supplies.
class RecordingRetrievalService extends KnowledgeRetrievalService {
  readonly calls: RetrieveKnowledgeChunksInput[] = [];

  constructor(private readonly chunks: RetrievedKnowledgeChunk[]) {
    super();
  }

  retrieve(
    input: RetrieveKnowledgeChunksInput,
  ): Promise<RetrievedKnowledgeChunk[]> {
    this.calls.push(input);
    return Promise.resolve(this.chunks);
  }
}

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

function createService({
  retrieval,
  minScore = RAG_TUTOR_MIN_SCORE,
}: {
  retrieval: KnowledgeRetrievalService;
  minScore?: number;
}): AgentService {
  const registry = new ToolRegistry([]);
  return new AgentService(
    new IdleLlmProvider(),
    new AssistantRegistry(),
    registry,
    new ToolExecutor(registry),
    retrieval,
    new FakeTutorAnswerGenerator(),
    minScore,
    new GraphCheckpointer(),
  );
}

// Drains the tutor stream and returns every event plus a convenience view of
// the terminal `final` payload (answer + citations) and the streamed token text.
async function runTutor(
  service: AgentService,
  input: { userId: string; conversationId: string; question: string },
): Promise<{
  events: TutorAgentEvent[];
  answer: string;
  citations: RagTutorCitation[];
  streamed: string;
}> {
  const events: TutorAgentEvent[] = [];
  for await (const event of service.streamTutorTurn(input)) {
    events.push(event);
  }
  const final = events.find((e) => e.type === 'final');
  const streamed = events
    .filter((e): e is Extract<TutorAgentEvent, { type: 'token' }> => e.type === 'token')
    .map((e) => e.delta)
    .join('');
  return {
    events,
    answer: final?.type === 'final' ? final.answer : '',
    citations: final?.type === 'final' ? final.citations : [],
    streamed,
  };
}

describe('AgentService.streamTutorTurn (tutor graph)', () => {
  it('streams a grounded answer + reference-only citations from strong chunks', async () => {
    const retrieval = new RecordingRetrievalService([
      chunk({ chunkId: 'kc-1', chunkIndex: 0, score: 0.82 }),
      chunk({ chunkId: 'kc-2', chunkIndex: 1, score: 0.76 }),
    ]);
    const service = createService({ retrieval });

    const { events, answer, citations, streamed } = await runTutor(service, {
      userId: 'u-1',
      conversationId: 'c-1',
      question: 'What is RAG?',
    });

    expect(answer.length).toBeGreaterThan(0);
    // The streamed token deltas reconstruct the answer exactly.
    expect(streamed).toBe(answer);
    // Progress is surfaced before the answer streams.
    expect(events[0]).toEqual({ type: 'progress', label: expect.any(String) });
    expect(citations).toEqual([
      { chunkId: 'kc-1', documentId: 'd1', documentName: 'x.md', chunkIndex: 0, score: 0.82 },
      { chunkId: 'kc-2', documentId: 'd1', documentName: 'x.md', chunkIndex: 1, score: 0.76 },
    ]);
    for (const citation of citations) {
      expect(Object.keys(citation).sort()).toEqual([
        'chunkId',
        'chunkIndex',
        'documentId',
        'documentName',
        'score',
      ]);
    }
  });

  it('scopes retrieval to the trusted userId (not settable via input)', async () => {
    const retrieval = new RecordingRetrievalService([chunk({ score: 0.9 })]);
    const service = createService({ retrieval });

    await runTutor(service, {
      userId: 'u-1',
      conversationId: 'c-1',
      question: 'anything',
    });

    expect(retrieval.calls).toHaveLength(1);
    expect(retrieval.calls[0].userId).toBe('u-1');
    expect(retrieval.calls[0].question).toBe('anything');
  });

  it('streams the safe fallback with no citations when no chunks are found', async () => {
    const service = createService({ retrieval: new RecordingRetrievalService([]) });

    const { answer, citations } = await runTutor(service, {
      userId: 'u-1',
      conversationId: 'c-1',
      question: 'no context',
    });

    expect(answer).toBe(RAG_TUTOR_FALLBACK_ANSWER);
    expect(citations).toEqual([]);
  });

  it('treats below-threshold chunks as no strong context (fallback)', async () => {
    const service = createService({
      retrieval: new RecordingRetrievalService([chunk({ score: 0.3 })]),
    });

    const { answer, citations } = await runTutor(service, {
      userId: 'u-1',
      conversationId: 'c-1',
      question: 'anything',
    });

    expect(answer).toBe(RAG_TUTOR_FALLBACK_ANSWER);
    expect(citations).toEqual([]);
  });

  it('honours a configured minScore', async () => {
    const service = createService({
      retrieval: new RecordingRetrievalService([chunk({ score: 0.82 })]),
      minScore: 0.9,
    });

    const { answer, citations } = await runTutor(service, {
      userId: 'u-1',
      conversationId: 'c-1',
      question: 'anything',
    });

    expect(answer).toBe(RAG_TUTOR_FALLBACK_ANSWER);
    expect(citations).toEqual([]);
  });
});
