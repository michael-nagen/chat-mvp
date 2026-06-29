import { createContext, useContext } from 'react';
import type { NewConversationContextValue } from './NewConversation.types';

export const NewConversationContext =
  createContext<NewConversationContextValue | null>(null);

export function useNewConversation(): NewConversationContextValue {
  const value = useContext(NewConversationContext);
  if (!value) {
    throw new Error('useNewConversation must be used inside NewConversationProvider');
  }

  return value;
}
