import type { Message } from '../../shared/entities/Message.types';

/** Props for the MessageList view, including a flag to distinguish the empty-selection state. */
export type MessageListViewProps = {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  hasSelectedConversation: boolean;
};

/** Reducer state for the message thread loading lifecycle. */
export type MessageListState = {
  isLoading: boolean;
  error: string | null;
};

/** Actions dispatched while loading the message thread. */
export type MessageListAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS' }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'NO_SELECTION' };

/** Props for the scrollable thread of message bubbles. */
export type MessageThreadListProps = {
  messages: Message[];
};

/** Props for the inline error state. */
export type MessageListErrorProps = {
  error: string;
};
