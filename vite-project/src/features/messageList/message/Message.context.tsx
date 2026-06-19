import { createContext, useContext } from 'react';
import type { MessageContextValue } from './Message.types';

export const MessageContext = createContext<MessageContextValue | null>(null);

export function useMessage(): MessageContextValue {
  const value = useContext(MessageContext);
  if (!value) {
    throw new Error('useMessage must be used inside MessageProvider');
  }

  return value;
}
