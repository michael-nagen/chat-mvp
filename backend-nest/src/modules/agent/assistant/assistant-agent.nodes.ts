import { END, type LangGraphRunnableConfig } from '@langchain/langgraph';
import type { LlmProvider } from '../../ai-provider/llm-provider';
import type { ProviderInputItem } from '../../ai-provider/ai-provider.types';
import type { ToolExecutor } from '../../assistant-tools/tool-executor/tool-executor';
import type { AssistantAgentState } from './assistant-agent.state';
import type {
  AssistantAgentEvent,
  AssistantToolCall,
} from './assistant-agent.types';
import { parseToolArguments } from './parse-tool-arguments';
import { toolProgressLabel } from './assistant-tool-labels';
import {
  ASSISTANT_GENERATION_FAILED_CODE,
  ASSISTANT_TOOL_LIMIT_CODE,
  MAX_TOOL_ITERATIONS,
} from './assistant-agent.constants';

export interface AssistantNodeDeps {
  provider: LlmProvider;
  toolExecutor: ToolExecutor;
}

type NodeUpdate = Partial<AssistantAgentState>;

function emit({
  config,
  event,
}: {
  config: LangGraphRunnableConfig;
  event: AssistantAgentEvent;
}): void {
  config.writer?.(event);
}

// One LLM turn: stream token deltas out through the custom writer and collect
// any tool calls. A provider failure ends the loop as a generation error; a
// turn with no tool calls is the final answer.
function makeAgentTurnNode({ provider }: AssistantNodeDeps) {
  return async function agentTurn(
    state: AssistantAgentState,
    config: LangGraphRunnableConfig,
  ): Promise<NodeUpdate> {
    let text = '';
    const toolCalls: AssistantToolCall[] = [];
    try {
      for await (const event of provider.streamTurn({
        system: state.system,
        items: state.items,
        tools: state.toolSpecs,
      })) {
        if (event.type === 'text-delta') {
          text += event.delta;
          emit({ config, event: { type: 'token', delta: event.delta } });
        } else {
          toolCalls.push({
            id: event.id,
            name: event.name,
            arguments: event.arguments,
          });
        }
      }
    } catch {
      emit({
        config,
        event: {
          type: 'error',
          code: ASSISTANT_GENERATION_FAILED_CODE,
          message: 'Failed to generate a response.',
        },
      });
      return { failed: true };
    }

    if (toolCalls.length === 0) {
      emit({ config, event: { type: 'final', answer: text } });
      return { answer: text, pendingToolCalls: [] };
    }

    return { pendingToolCalls: toolCalls };
  };
}

// Executes the pending tool calls through the existing ToolExecutor, injecting
// the trusted userId from config (never from the model). Extends the running
// item list with each call + its result, then enforces the turn cap.
function makeRunToolsNode({ toolExecutor }: AssistantNodeDeps) {
  return async function runTools(
    state: AssistantAgentState,
    config: LangGraphRunnableConfig,
  ): Promise<NodeUpdate> {
    const userId = readUserId(config);
    const items: ProviderInputItem[] = [...state.items];
    for (const call of state.pendingToolCalls) {
      emit({
        config,
        event: { type: 'progress', label: toolProgressLabel(call.name) },
      });
      items.push({
        kind: 'tool_call',
        id: call.id,
        name: call.name,
        arguments: call.arguments,
      });
      const result = await toolExecutor.execute({
        name: call.name,
        rawInput: parseToolArguments(call.arguments),
        userId,
      });
      items.push({
        kind: 'tool_result',
        id: call.id,
        result: JSON.stringify(result),
      });
    }

    const turnsTaken = state.turnsTaken + 1;
    if (turnsTaken >= MAX_TOOL_ITERATIONS) {
      emit({
        config,
        event: {
          type: 'error',
          code: ASSISTANT_TOOL_LIMIT_CODE,
          message: 'The assistant could not complete the request.',
        },
      });
      return { items, turnsTaken, limitReached: true };
    }

    return { items, turnsTaken, pendingToolCalls: [] };
  };
}

function readUserId(config: LangGraphRunnableConfig): string {
  const userId = config.configurable?.userId as string | undefined;
  if (userId === undefined) {
    throw new Error('Assistant agent invoked without a trusted userId.');
  }
  return userId;
}

export function afterAgentTurn(
  state: AssistantAgentState,
): 'run_tools' | typeof END {
  if (state.failed || state.pendingToolCalls.length === 0) {
    return END;
  }
  return 'run_tools';
}

export function afterRunTools(
  state: AssistantAgentState,
): 'agent_turn' | typeof END {
  return state.limitReached ? END : 'agent_turn';
}

export function buildAssistantNodes(deps: AssistantNodeDeps) {
  return {
    agentTurn: makeAgentTurnNode(deps),
    runTools: makeRunToolsNode(deps),
  };
}
