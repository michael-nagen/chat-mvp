import type { ReactNode } from 'react';
import { NewConversationContext } from './NewConversation.context';
import { useNewConversationController } from './NewConversation.use';

/** Owns the new-conversation modal state so each control reads it from context. */
export function NewConversationProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const value = useNewConversationController();

  return (
    <NewConversationContext.Provider value={value}>
      {children}
    </NewConversationContext.Provider>
  );
}
