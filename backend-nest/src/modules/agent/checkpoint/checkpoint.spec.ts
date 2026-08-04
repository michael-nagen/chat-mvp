import { AgentService } from '../agent.service';
import { LlmProvider } from '../../ai-provider/llm-provider';
import type {
  ProviderMessage,
  ProviderTurnEvent,
} from '../../ai-provider/ai-provider.types';
import { AssistantRegistry } from '../../assistant/assistant.registry';
import { ToolRegistry } from '../../assistant-tools/tool-registry/tool-registry';
import { ToolExecutor } from '../../assistant-tools/tool-executor/tool-executor';
import { KnowledgeRetrievalService } from '../../rag-tutor/retrieval/knowledge-retrieval.service';
import { FakeTutorAnswerGenerator } from '../../rag-tutor/generation/fake-tutor-answer-generator';
import { RAG_TUTOR_MIN_SCORE } from '../../rag-tutor/config/rag-tutor.constants';
import type {
  RetrievedKnowledgeChunk,
  RetrieveKnowledgeChunksInput,
} from '../../rag-tutor/rag-tutor.types';
import { GraphCheckpointer } from './checkpoint.provider';

// Plain provider: one turn, no tool calls, so the assistant finalizes cleanly.
class PlainLlmProvider extends LlmProvider {
  complete(): Promise<string> {
    return Promise.resolve('');
  }
  async *streamTurn(): AsyncIterable<ProviderTurnEvent> {
    yield { type: 'text-delta', delta: 'Hi' };
  }
}

class StubRetrieval extends KnowledgeRetrievalService {
  retrieve(_input: RetrieveKnowledgeChunksInput): Promise<RetrievedKnowledgeChunk[]> {
    return Promise.resolve([
      {
        chunkId: 'kc-1',
        documentId: 'd1',
        documentName: 'x.md',
        chunkIndex: 0,
        text: 'text',
        score: 0.9,
      },
    ]);
  }
}

function createAgent(): { service: AgentService; checkpointer: GraphCheckpointer } {
  const registry = new ToolRegistry([]);
  const checkpointer = new GraphCheckpointer();
  const service = new AgentService(
    new PlainLlmProvider(),
    new AssistantRegistry(),
    registry,
    new ToolExecutor(registry),
    new StubRetrieval(),
    new FakeTutorAnswerGenerator(),
    RAG_TUTOR_MIN_SCORE,
    checkpointer,
  );
  return { service, checkpointer };
}

async function runAssistant(
  service: AgentService,
  conversationId: string,
  userId = 'u-1',
): Promise<void> {
  const messages: ProviderMessage[] = [
    { role: 'user', content: `hello ${conversationId}` },
  ];
  for await (const _event of service.streamAssistantTurn({
    userId,
    conversationId,
    messages,
    assistantId: 'general-assistant',
  })) {
    // Tokens are transient UI output; we only care about persisted state here.
  }
}

const threadConfig = (threadId: string) => ({
  configurable: { thread_id: threadId, checkpoint_ns: '' },
});

describe('LangGraph MongoDB checkpointing (via in-memory saver)', () => {
  it('creates a checkpoint keyed by thread_id = conversationId', async () => {
    const { service, checkpointer } = createAgent();

    await runAssistant(service, 'c-1');

    expect(await checkpointer.saver.getTuple(threadConfig('c-1'))).toBeDefined();
    expect(
      await checkpointer.saver.getTuple(threadConfig('c-unused')),
    ).toBeUndefined();
  });

  it('persists assistant state that can be resumed, without leaking userId', async () => {
    const { service, checkpointer } = createAgent();

    await runAssistant(service, 'c-1');

    const tuple = await checkpointer.saver.getTuple(threadConfig('c-1'));
    const values = tuple?.checkpoint.channel_values ?? {};
    expect((values.items as unknown[]).length).toBeGreaterThan(0);
    // userId travels in config.configurable, never a graph channel, so it must
    // not appear in the persisted state.
    expect(Object.keys(values)).not.toContain('userId');
  });

  it('keeps different conversations isolated', async () => {
    const { service, checkpointer } = createAgent();

    await runAssistant(service, 'c-1');
    await runAssistant(service, 'c-2');

    const a = await checkpointer.saver.getTuple(threadConfig('c-1'));
    const b = await checkpointer.saver.getTuple(threadConfig('c-2'));
    expect(a).toBeDefined();
    expect(b).toBeDefined();
    expect(a?.checkpoint.channel_values.items).not.toEqual(
      b?.checkpoint.channel_values.items,
    );
  });

  it('persists tutor state (answer + citations) under its conversation thread', async () => {
    const { service, checkpointer } = createAgent();

    let answer = '';
    let citations: unknown[] = [];
    for await (const event of service.streamTutorTurn({
      userId: 'u-1',
      conversationId: 'tc-1',
      question: 'What is RAG?',
    })) {
      if (event.type === 'final') {
        answer = event.answer;
        citations = event.citations;
      }
    }
    expect(citations.length).toBeGreaterThan(0);

    const tuple = await checkpointer.saver.getTuple(threadConfig('tc-1'));
    const values = tuple?.checkpoint.channel_values ?? {};
    expect(values.answer).toBe(answer);
    expect(values.citations).toEqual(citations);
    expect(Object.keys(values)).not.toContain('userId');
  });

  it('isolates two conversations belonging to the same user', async () => {
    const { service, checkpointer } = createAgent();

    await runAssistant(service, 'c-a', 'same-user');
    await runAssistant(service, 'c-b', 'same-user');

    expect(await checkpointer.saver.getTuple(threadConfig('c-a'))).toBeDefined();
    expect(await checkpointer.saver.getTuple(threadConfig('c-b'))).toBeDefined();
  });
});
