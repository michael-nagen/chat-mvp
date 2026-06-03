import { createContext, useContext } from 'react';
import type { MessageThreadContextValue } from './MessageThread.types';

export const MessageThreadContext = createContext<MessageThreadContextValue | null>(null);

export function useMessageThread(): MessageThreadContextValue {
  const value = useContext(MessageThreadContext);
  if (!value) {
    throw new Error('useMessageThread must be used inside MessageThreadProvider');
  }

  return value;
}
