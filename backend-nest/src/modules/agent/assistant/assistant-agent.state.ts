import { Annotation } from '@langchain/langgraph';
import type {
  ProviderInputItem,
  ProviderToolSpec,
} from '../../ai-provider/ai-provider.types';
import type { AssistantToolCall } from './assistant-agent.types';

// State for the assistant tool loop. Scalars are last-write-wins; array fields
// default to [] so nodes can return partial updates. The trusted userId is not
// a channel here — it travels in config.configurable so the model can never
// write it.
export const AssistantAgentStateAnnotation = Annotation.Root({
  system: Annotation<string>,
  items: Annotation<ProviderInputItem[]>({
    reducer: (_prev, next) => next,
    default: () => [],
  }),
  toolSpecs: Annotation<ProviderToolSpec[]>({
    reducer: (_prev, next) => next,
    default: () => [],
  }),
  turnsTaken: Annotation<number>({
    reducer: (_prev, next) => next,
    default: () => 0,
  }),
  pendingToolCalls: Annotation<AssistantToolCall[]>({
    reducer: (_prev, next) => next,
    default: () => [],
  }),
  answer: Annotation<string | undefined>,
  failed: Annotation<boolean>({
    reducer: (_prev, next) => next,
    default: () => false,
  }),
  limitReached: Annotation<boolean>({
    reducer: (_prev, next) => next,
    default: () => false,
  }),
});

export type AssistantAgentState = typeof AssistantAgentStateAnnotation.State;
