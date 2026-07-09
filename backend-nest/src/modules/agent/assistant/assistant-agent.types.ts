import type { ProviderMessage } from '../../ai-provider/ai-provider.types';

export interface AssistantTurnInput {
  userId: string;
  conversationId: string;
  messages: ProviderMessage[];
  assistantId: string;
}

export interface AssistantToolCall {
  id: string;
  name: string;
  arguments: string;
}

// Events the assistant graph emits through the custom stream writer. The
// orchestrator maps these back onto the SSE contract (token/progress/done/error);
// they are never sent to the client directly. `progress` is a transient status
// (e.g. surfaced while a tool runs) and is not persisted.
export type AssistantAgentEvent =
  | { type: 'token'; delta: string }
  | { type: 'progress'; label: string }
  | { type: 'final'; answer: string }
  | { type: 'error'; code: string; message: string };
