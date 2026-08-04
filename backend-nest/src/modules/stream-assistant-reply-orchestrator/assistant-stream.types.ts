import type { RagTutorCitation } from '../rag-tutor/rag-tutor.types';

export interface TokenEventData {
  delta: string;
}

export interface DoneEventData {
  messageId: string;
}

// Tutor `done` carries the persisted reply id plus its reference-only citations
// so the client can attach them to the streamed message without a refetch.
export interface TutorDoneEventData {
  messageId: string;
  citations: RagTutorCitation[];
}

// A transient, human-readable status shown while the agent works (e.g.
// "Searching your documents…"). Never persisted.
export interface ProgressEventData {
  label: string;
}

export interface ErrorEventData {
  code: string;
  message: string;
}
