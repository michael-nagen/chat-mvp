import { Inject, Injectable } from '@nestjs/common';
import { LlmProvider } from '../ai-provider/llm-provider';
import type { ProviderInputItem } from '../ai-provider/ai-provider.types';
import { AssistantRegistry } from '../assistant/assistant.registry';
import { ToolRegistry } from '../assistant-tools/tool-registry/tool-registry';
import { ToolExecutor } from '../assistant-tools/tool-executor/tool-executor';
import { KnowledgeRetrievalService } from '../rag-tutor/retrieval/knowledge-retrieval.service';
import { TutorAnswerGenerator } from '../rag-tutor/generation/tutor-answer-generator';
import { RAG_TUTOR_MIN_SCORE_TOKEN } from '../rag-tutor/config/rag-tutor.constants';
import type { RagTutorCitation } from '../rag-tutor/rag-tutor.types';
import { GraphCheckpointer } from './checkpoint/checkpoint.provider';
import { buildAssistantGraph } from './assistant/assistant-agent.graph';
import { buildTutorGraph } from './tutor/tutor-agent.graph';
import { toProviderToolSpec } from './assistant/tool-spec.mapper';
import { splitAnswerIntoTokens } from './tutor/tutor-stream.util';
import {
  TUTOR_GENERATION_FAILED_CODE,
  TUTOR_PROGRESS_GENERATING,
  TUTOR_PROGRESS_SEARCHING,
} from './tutor/tutor-stream.constants';
import type {
  StreamTutorTurnInput,
  TutorAgentEvent,
  TutorGraphInput,
} from './tutor/tutor-agent.types';
import type {
  AssistantAgentEvent,
  AssistantTurnInput,
} from './assistant/assistant-agent.types';

@Injectable()
export class AgentService {
  private readonly assistantGraph: ReturnType<typeof buildAssistantGraph>;
  private readonly tutorGraph: ReturnType<typeof buildTutorGraph>;

  constructor(
    private readonly provider: LlmProvider,
    private readonly assistants: AssistantRegistry,
    private readonly tools: ToolRegistry,
    private readonly toolExecutor: ToolExecutor,
    private readonly retrieval: KnowledgeRetrievalService,
    private readonly generator: TutorAnswerGenerator,
    @Inject(RAG_TUTOR_MIN_SCORE_TOKEN) private readonly minScore: number,
    private readonly checkpoint: GraphCheckpointer,
  ) {
    this.assistantGraph = buildAssistantGraph({
      provider: this.provider,
      toolExecutor: this.toolExecutor,
      checkpointer: this.checkpoint.saver,
    });
    this.tutorGraph = buildTutorGraph({
      retrieval: this.retrieval,
      generator: this.generator,
      minScore: this.minScore,
      checkpointer: this.checkpoint.saver,
    });
  }

  // Runs one assistant reply through the LangGraph loop, emitting internal
  // token/final/error events. Persistence and SSE mapping stay in the
  // orchestrator; the trusted userId is passed via config, never model state.
  async *streamAssistantTurn(
    input: AssistantTurnInput,
  ): AsyncGenerator<AssistantAgentEvent> {
    const assistant = this.assistants.resolve({ assistantId: input.assistantId });
    const items: ProviderInputItem[] = input.messages.map((message) => ({
      kind: 'message',
      role: message.role,
      content: message.content,
    }));
    const toolSpecs = this.tools.list().map(toProviderToolSpec);

    // thread_id = conversationId persists/resumes this conversation's run. The
    // loop-control channels are reset on every turn so a resumed thread behaves
    // exactly like a fresh one — conversational context is rebuilt from DB
    // messages into `items`, so nothing is lost.
    const stream = await this.assistantGraph.stream(
      {
        system: assistant.systemPrompt,
        items,
        toolSpecs,
        turnsTaken: 0,
        pendingToolCalls: [],
        failed: false,
        limitReached: false,
      },
      {
        streamMode: 'custom',
        configurable: {
          userId: input.userId,
          thread_id: input.conversationId,
        },
      },
    );

    for await (const chunk of stream) {
      yield chunk as AssistantAgentEvent;
    }
  }

  // Runs the tutor path through the LangGraph and emits streaming events. The
  // graph produces the whole grounded answer (or the safe fallback) plus its
  // reference-only citations; we surface progress, replay the answer as tokens
  // for progressive rendering, and end with a `final` carrying the citations the
  // orchestrator persists. The trusted userId travels via config, never graph
  // state, so retrieval can never be scoped to another user.
  async *streamTutorTurn({
    userId,
    conversationId,
    question,
  }: StreamTutorTurnInput): AsyncGenerator<TutorAgentEvent> {
    yield { type: 'progress', label: TUTOR_PROGRESS_SEARCHING };

    let answer: string;
    let citations: RagTutorCitation[];
    try {
      const input: TutorGraphInput = { question };
      const finalState = await this.tutorGraph.invoke(input, {
        configurable: { userId, thread_id: conversationId },
      });
      answer = finalState.answer ?? '';
      citations = finalState.citations;
    } catch {
      yield {
        type: 'error',
        code: TUTOR_GENERATION_FAILED_CODE,
        message: 'Failed to generate a tutor response.',
      };
      return;
    }

    yield { type: 'progress', label: TUTOR_PROGRESS_GENERATING };
    for (const delta of splitAnswerIntoTokens(answer)) {
      yield { type: 'token', delta };
    }
    yield { type: 'final', answer, citations };
  }
}
