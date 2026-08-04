import { Annotation } from '@langchain/langgraph';
import type {
  RagTutorCitation,
  RetrievedKnowledgeChunk,
} from '../../rag-tutor/rag-tutor.types';

// Tutor graph state. Scalars are last-write-wins; array fields default to [] so
// nodes can return partial updates. userId is intentionally not a channel — it
// is read from config.configurable so it can never be written from graph input.
export const TutorAgentStateAnnotation = Annotation.Root({
  question: Annotation<string>,
  strongChunks: Annotation<RetrievedKnowledgeChunk[]>({
    reducer: (_prev, next) => next,
    default: () => [],
  }),
  answer: Annotation<string | undefined>,
  citations: Annotation<RagTutorCitation[]>({
    reducer: (_prev, next) => next,
    default: () => [],
  }),
});

export type TutorAgentState = typeof TutorAgentStateAnnotation.State;
