import type { ReactNode } from 'react';
import { MessageThreadContext } from './MessageThread.context';
import { useMessageThreadController } from './MessageThread.use';

export function MessageThreadProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const value = useMessageThreadController();

  return (
    <MessageThreadContext.Provider value={value}>
      {children}
    </MessageThreadContext.Provider>
  );
}
