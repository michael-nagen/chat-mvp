import { AgentService } from '../agent.service';
import { LlmProvider } from '../../ai-provider/llm-provider';
import type {
  ProviderMessage,
  ProviderTurnEvent,
} from '../../ai-provider/ai-provider.types';
import { AssistantRegistry } from '../../assistant/assistant.registry';
import { ToolRegistry } from '../../assistant-tools/tool-registry/tool-registry';
import { ToolExecutor } from '../../assistant-tools/tool-executor/tool-executor';
import type { ToolResult } from '../../assistant-tools/tool-executor/tool-executor.types';
import { MockKnowledgeRetrievalService } from '../../rag-tutor/retrieval/mock-knowledge-retrieval.service';
import { FakeTutorAnswerGenerator } from '../../rag-tutor/generation/fake-tutor-answer-generator';
import { RAG_TUTOR_MIN_SCORE } from '../../rag-tutor/config/rag-tutor.constants';
import { GraphCheckpointer } from '../checkpoint/checkpoint.provider';
import type { AssistantAgentEvent } from './assistant-agent.types';
import {
  ASSISTANT_GENERATION_FAILED_CODE,
  ASSISTANT_TOOL_LIMIT_CODE,
} from './assistant-agent.constants';

// Each script entry is one turn's worth of provider events.
class ScriptedLlmProvider extends LlmProvider {
  private turn = 0;

  constructor(
    private readonly script: ProviderTurnEvent[][],
    private readonly onError?: () => never,
  ) {
    super();
  }

  complete(): Promise<string> {
    return Promise.resolve('');
  }

  async *streamTurn(): AsyncIterable<ProviderTurnEvent> {
    if (this.onError) {
      this.onError();
    }
    const events = this.script[this.turn] ?? this.script[this.script.length - 1];
    this.turn += 1;
    for (const event of events) {
      yield event;
    }
  }
}

// Records the userId it was invoked with so the security invariant is testable.
class RecordingToolExecutor extends ToolExecutor {
  readonly calls: Array<{ name: string; rawInput: unknown; userId: string }> = [];

  constructor() {
    super(new ToolRegistry([]));
  }

  execute(params: {
    name: string;
    rawInput: unknown;
    userId: string;
  }): Promise<ToolResult> {
    this.calls.push(params);
    return Promise.resolve({ ok: true, output: { called: params.name } });
  }
}

function createService({
  provider,
  toolExecutor,
}: {
  provider: LlmProvider;
  toolExecutor: ToolExecutor;
}): AgentService {
  const registry = new ToolRegistry([]);
  return new AgentService(
    provider,
    new AssistantRegistry(),
    registry,
    toolExecutor,
    new MockKnowledgeRetrievalService(),
    new FakeTutorAnswerGenerator(),
    RAG_TUTOR_MIN_SCORE,
    new GraphCheckpointer(),
  );
}

async function collect(service: AgentService): Promise<AssistantAgentEvent[]> {
  const messages: ProviderMessage[] = [{ role: 'user', content: 'hello' }];
  const events: AssistantAgentEvent[] = [];
  for await (const event of service.streamAssistantTurn({
    userId: 'u-1',
    conversationId: 'c-1',
    messages,
    assistantId: 'general-assistant',
  })) {
    events.push(event);
  }
  return events;
}

describe('AgentService.streamAssistantTurn', () => {
  it('streams token deltas then a final answer for a plain response', async () => {
    const provider = new ScriptedLlmProvider([
      [
        { type: 'text-delta', delta: 'Hello' },
        { type: 'text-delta', delta: ', world' },
      ],
    ]);
    const service = createService({
      provider,
      toolExecutor: new RecordingToolExecutor(),
    });

    const events = await collect(service);

    expect(events).toEqual([
      { type: 'token', delta: 'Hello' },
      { type: 'token', delta: ', world' },
      { type: 'final', answer: 'Hello, world' },
    ]);
  });

  it('executes tool calls via ToolExecutor with the trusted userId', async () => {
    const provider = new ScriptedLlmProvider([
      [{ type: 'tool-call', id: 't1', name: 'list_my_conversations', arguments: '{"userId":"attacker"}' }],
      [{ type: 'text-delta', delta: 'Done' }],
    ]);
    const toolExecutor = new RecordingToolExecutor();
    const service = createService({ provider, toolExecutor });

    const events = await collect(service);

    expect(toolExecutor.calls).toHaveLength(1);
    expect(toolExecutor.calls[0].userId).toBe('u-1');
    expect(toolExecutor.calls[0].name).toBe('list_my_conversations');
    // A progress event is surfaced while the tool runs so the UI is not blank.
    expect(events).toContainEqual({
      type: 'progress',
      label: 'Looking up your conversations…',
    });
    expect(events.at(-1)).toEqual({ type: 'final', answer: 'Done' });
  });

  it('emits a tool-limit error after the max iterations without an answer', async () => {
    const provider = new ScriptedLlmProvider([
      [{ type: 'tool-call', id: 't', name: 'list_my_conversations', arguments: '{}' }],
    ]);
    const service = createService({
      provider,
      toolExecutor: new RecordingToolExecutor(),
    });

    const events = await collect(service);

    expect(events.some((e) => e.type === 'final')).toBe(false);
    expect(events.at(-1)).toEqual({
      type: 'error',
      code: ASSISTANT_TOOL_LIMIT_CODE,
      message: 'The assistant could not complete the request.',
    });
  });

  it('emits a generation error when the provider throws', async () => {
    const provider = new ScriptedLlmProvider([[]], () => {
      throw new Error('provider down');
    });
    const service = createService({
      provider,
      toolExecutor: new RecordingToolExecutor(),
    });

    const events = await collect(service);

    expect(events).toEqual([
      {
        type: 'error',
        code: ASSISTANT_GENERATION_FAILED_CODE,
        message: 'Failed to generate a response.',
      },
    ]);
  });
});
