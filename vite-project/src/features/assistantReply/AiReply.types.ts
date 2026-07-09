import type { MessageCitation } from '../../shared/entities/Message.types';

// Callbacks the stream client invokes as SSE events arrive. Assistant and tutor
// share this contract; tutor additionally emits progress and citations, so
// onProgress is optional and onDone always receives (possibly empty) citations.
export type AiStreamHandlers = {
  onToken: (delta: string) => void;
  onProgress?: (label: string) => void;
  onDone: (messageId: string, citations: MessageCitation[]) => void;
};
