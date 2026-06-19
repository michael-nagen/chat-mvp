import { createContext, useContext } from 'react';
import type { ChatParticipantsContextValue } from './ChatParticipants.types';

export const ChatParticipantsContext =
  createContext<ChatParticipantsContextValue | null>(null);

export function useChatParticipants(): ChatParticipantsContextValue {
  const value = useContext(ChatParticipantsContext);
  if (!value) {
    throw new Error('useChatParticipants must be used inside ChatParticipantsProvider');
  }

  return value;
}
