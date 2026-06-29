import { useState } from 'react';
import type { Conversation } from '../../shared/entities/Conversation.types';
import type { ChatSelectionContextValue } from './ChatSelection.types';

/** Drives the chat selection provider: holds the selected conversation and the refresh token. */
export function useChatSelectionController(): ChatSelectionContextValue {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  function selectConversation(id: string, conversation?: Conversation): void {
    setSelectedConversationId(id);
    setSelectedConversation(conversation ?? null);
  }

  function refreshConversations(): void {
    setRefreshToken((token) => token + 1);
  }

  return {
    selectedConversationId,
    selectedConversation,
    selectConversation,
    refreshToken,
    refreshConversations,
  };
}
