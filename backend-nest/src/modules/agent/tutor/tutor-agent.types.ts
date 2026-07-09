import type { RagTutorCitation } from '../../rag-tutor/rag-tutor.types';

// The tutor graph is fed only the question. The trusted userId travels through
// config.configurable, never the graph state, so the model can never set it.
export interface TutorGraphInput {
  question: string;
}

export interface StreamTutorTurnInput {
  userId: string;
  conversationId: string;
  question: string;
}

// Events the tutor stream emits. The orchestrator maps these onto the SSE
// contract: progress/token pass through, final drives persistence + the `done`
// payload (messageId + citations), and error becomes an `error` event. They are
// never sent to the client directly.
export type TutorAgentEvent =
  | { type: 'progress'; label: string }
  | { type: 'token'; delta: string }
  | { type: 'final'; answer: string; citations: RagTutorCitation[] }
  | { type: 'error'; code: string; message: string };
