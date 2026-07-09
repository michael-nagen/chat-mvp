import type { Message, MessageCitation } from '../../shared/entities/Message.types';

/** The only transitions allowed against a conversation's message array. */
export type MessageThreadAction =
  | { type: 'REPLACE'; messages: Message[] }
  | { type: 'ADD_OPTIMISTIC'; message: Message }
  | { type: 'CONFIRM'; tempId: string; message: Message }
  | { type: 'ROLLBACK'; tempId: string }
  // Streaming AI reply: show a transient progress status, grow the in-progress
  // bubble, then stamp its real id and (for tutor answers) its citations.
  | { type: 'SET_ASSISTANT_STATUS'; tempId: string; label: string }
  | { type: 'APPEND_ASSISTANT_DELTA'; tempId: string; delta: string }
  | {
      type: 'FINISH_ASSISTANT';
      tempId: string;
      messageId: string;
      citations: MessageCitation[];
    };

export type MessageThreadContextValue = {
  messages: Message[];
  /** Replace the whole thread, e.g. after fetching a conversation. */
  replaceMessages: (messages: Message[]) => void;
  /** Append a not-yet-confirmed message for optimistic send. */
  addOptimisticMessage: (message: Message) => void;
  /** Swap an optimistic message for the server-confirmed one. */
  confirmMessage: (tempId: string, message: Message) => void;
  /** Drop an optimistic message after a failed send. */
  rollbackMessage: (tempId: string) => void;
  /** Show a transient progress status on the in-progress AI message. */
  setAssistantStatus: (tempId: string, label: string) => void;
  /** Append a streamed token delta to the in-progress AI message. */
  appendAssistantDelta: (tempId: string, delta: string) => void;
  /** Stamp the persisted message id (and any citations) once streaming completes. */
  finishAssistant: (
    tempId: string,
    messageId: string,
    citations: MessageCitation[],
  ) => void;
};
