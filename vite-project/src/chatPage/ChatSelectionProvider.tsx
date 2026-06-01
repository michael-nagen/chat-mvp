import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChatSelectionContext } from './ChatSelection.context';

export function ChatSelectionProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  function selectConversation(id: string): void {
    setSelectedConversationId(id);
  }

  return (
    <ChatSelectionContext.Provider value={{ selectedConversationId, selectConversation }}>
      {children}
    </ChatSelectionContext.Provider>
  );
}
