export type ChatSelectionContextValue = {
  selectedConversationId: string | null;
  selectConversation: (id: string) => void;
};
