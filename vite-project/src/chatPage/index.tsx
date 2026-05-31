import type { User } from '../shared/contract/contract';
import { useChatPage } from './ChatPage.use';
import { ChatPageView } from './ChatPage.view';

/** Props for the ChatPage entry-point component. */
export type ChatPageProps = {
  currentUser: User;
};

/** Top-level chat page component that connects the useChatPage hook to ChatPageView. */
export function ChatPage(props: ChatPageProps) {
  const viewProps = useChatPage(props);
  return <ChatPageView {...viewProps} />;
}
