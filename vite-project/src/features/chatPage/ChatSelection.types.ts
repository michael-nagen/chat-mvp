export type ChatSelectionContextValue = {
  selectedConversationId: string | null;
  selectConversation: (id: string) => void;
  // Bumped to make the conversation list re-fetch (e.g. after creating one).
  refreshToken: number;
  refreshConversations: () => void;
};
