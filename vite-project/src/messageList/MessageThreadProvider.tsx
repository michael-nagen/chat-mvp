import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Message } from '../entities/Message.types';
import { MessageThreadContext } from './MessageThread.context';

export function MessageThreadProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <MessageThreadContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessageThreadContext.Provider>
  );
}
