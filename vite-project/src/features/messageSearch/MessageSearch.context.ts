import { createContext, useContext } from 'react';
import type { MessageSearchContextValue } from './MessageSearch.use';

export const MessageSearchContext = createContext<MessageSearchContextValue | null>(null);

export function useMessageSearchContext(): MessageSearchContextValue {
  const value = useContext(MessageSearchContext);
  if (!value) {
    throw new Error('useMessageSearchContext must be used inside MessageSearch');
  }

  return value;
}
