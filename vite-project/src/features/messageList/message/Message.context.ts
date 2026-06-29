import { createContext, useContext } from 'react';
import type { MessageProps } from './Message.types';

export const MessageContext = createContext<MessageProps | null>(null);

export function useMessage(): MessageProps {
  const value = useContext(MessageContext);
  if (!value) {
    throw new Error('useMessage must be used inside MessageProvider');
  }

  return value;
}
