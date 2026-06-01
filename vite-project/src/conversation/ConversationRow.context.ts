import { createContext, useContext } from 'react';
import type { ConversationRowContextValue } from './ConversationRow.types';

export const ConversationRowContext = createContext<ConversationRowContextValue | null>(null);

export function useConversationRowContext(): ConversationRowContextValue {
  const value = useContext(ConversationRowContext);
  if (!value) {
    throw new Error('useConversationRowContext must be used inside ConversationRowProvider');
  }

  return value;
}
