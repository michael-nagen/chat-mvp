import type { Conversation } from '../../shared/entities/Conversation.types';

export type ChatSelectionContextValue = {
  selectedConversationId: string | null;
  // The selected conversation when the caller had the full object (e.g. a list
  // row); null when selected by id only (e.g. jumping from a search result).
  selectedConversation: Conversation | null;
  selectConversation: (id: string, conversation?: Conversation) => void;
  // Bumped to make the conversation list re-fetch (e.g. after creating one).
  refreshToken: number;
  refreshConversations: () => void;
};
