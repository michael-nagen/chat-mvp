import { useState } from 'react';
import type { ChatSelectionContextValue } from './ChatSelection.types';

/** Drives the chat selection provider: holds the selected conversation and the refresh token. */
export function useChatSelectionController(): ChatSelectionContextValue {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  function selectConversation(id: string): void {
    setSelectedConversationId(id);
  }

  function refreshConversations(): void {
    setRefreshToken((token) => token + 1);
  }

  return { selectedConversationId, selectConversation, refreshToken, refreshConversations };
}
