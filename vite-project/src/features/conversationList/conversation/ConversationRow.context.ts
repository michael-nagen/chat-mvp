import { createContext, useContext } from 'react';
import type { ConversationRowProps } from './ConversationRow.types';

export const ConversationRowContext = createContext<ConversationRowProps | null>(null);

export function useConversationRowContext(): ConversationRowProps {
  const value = useContext(ConversationRowContext);
  if (!value) {
    throw new Error('useConversationRowContext must be used inside ConversationRowProvider');
  }

  return value;
}
