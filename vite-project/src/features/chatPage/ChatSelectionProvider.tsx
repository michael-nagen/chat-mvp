import type { ReactNode } from 'react';
import { ChatSelectionContext } from './ChatSelection.context';
import { useChatSelectionController } from './ChatSelectionProvider.use';

export function ChatSelectionProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const value = useChatSelectionController();

  return <ChatSelectionContext.Provider value={value}>{children}</ChatSelectionContext.Provider>;
}
