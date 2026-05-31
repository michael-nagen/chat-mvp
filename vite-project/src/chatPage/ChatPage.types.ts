import type { ConversationListProps } from '../conversationList/ConversationList.types';
import type { MessageListViewProps } from '../messageList/MessageList.types';
import type { MessageComposerProps } from '../messageComposer/MessageComposer.types';
import type { ToastProps } from '../toast';

/** All props needed by ChatPageView, composed from the child component prop shapes. */
export type ChatPageViewProps = {
  conversationListProps: ConversationListProps;
  messageListProps: MessageListViewProps;
  composerProps: MessageComposerProps;
  toastProps: ToastProps;
  currentUserName: string;
};
