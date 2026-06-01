import { createContext, useContext } from 'react';
import type { ChatSelectionContextValue } from './ChatSelection.types';

export const ChatSelectionContext = createContext<ChatSelectionContextValue | null>(null);

export function useChatSelection(): ChatSelectionContextValue {
  const value = useContext(ChatSelectionContext);
  if (!value) {
    throw new Error('useChatSelection must be used inside ChatSelectionProvider');
  }

  return value;
}
