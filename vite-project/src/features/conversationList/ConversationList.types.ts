import type { Conversation } from '../../shared/entities/Conversation.types';

/** Props consumed by the pure ConversationList view. */
export type ConversationListViewProps = {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
};

/** Reducer state for the conversation list loading lifecycle. */
export type ConversationListState = {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
};

/** Actions dispatched while loading the conversation list. */
export type ConversationListAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; conversations: Conversation[] }
  | { type: 'LOAD_ERROR'; error: string };

/** Props for the scrollable list of conversation rows. */
export type ConversationRowsProps = {
  conversations: Conversation[];
};

/** Props for the inline error state. */
export type ConversationListErrorProps = {
  error: string;
};
