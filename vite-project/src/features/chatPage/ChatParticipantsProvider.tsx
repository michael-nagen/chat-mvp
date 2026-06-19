import type { ReactNode } from 'react';
import { ChatParticipantsContext } from './ChatParticipants.context';
import { useChatParticipantsController } from './ChatParticipantsProvider.use';

export function ChatParticipantsProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const value = useChatParticipantsController();

  return (
    <ChatParticipantsContext.Provider value={value}>
      {children}
    </ChatParticipantsContext.Provider>
  );
}
