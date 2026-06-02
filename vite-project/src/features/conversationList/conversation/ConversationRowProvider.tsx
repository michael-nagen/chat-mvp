import type { ReactNode } from 'react';
import type { Conversation } from '../../../shared/entities/Conversation.types';
import { ConversationRowContext } from './ConversationRow.context';

type ConversationRowProviderProps = {
  conversation: Conversation;
  children: ReactNode;
};

export function ConversationRowProvider({
  conversation,
  children,
}: ConversationRowProviderProps): React.JSX.Element {
  return (
    <ConversationRowContext.Provider value={{ conversation }}>
      {children}
    </ConversationRowContext.Provider>
  );
}
