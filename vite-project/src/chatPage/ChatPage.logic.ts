import type { Conversation, Message } from '../shared/contract/contract';
import type { ChatPageViewProps } from './ChatPage.types';

/** Assembles the full ChatPageViewProps tree from raw async state and event callbacks. */
export function buildChatPageViewProps(args: {
  conversations: Conversation[];
  isLoadingConversations: boolean;
  conversationsError: string | null;
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  messages: Message[];
  isLoadingMessages: boolean;
  messagesError: string | null;
  composerValue: string;
  isSending: boolean;
  onComposerChange: (value: string) => void;
  onComposerSend: () => void;
  currentUserName: string;
  sendError: string | null;
  onDismissSendError: () => void;
}): ChatPageViewProps {
  return {
    conversationListProps: {
      conversations: args.conversations,
      selectedConversationId: args.selectedConversationId,
      isLoading: args.isLoadingConversations,
      error: args.conversationsError,
      onSelectConversation: args.onSelectConversation,
    },
    messageListProps: {
      messages: args.messages,
      isLoading: args.isLoadingMessages,
      error: args.messagesError,
      hasSelectedConversation: args.selectedConversationId !== null,
    },
    composerProps: {
      value: args.composerValue,
      onChange: args.onComposerChange,
      onSend: args.onComposerSend,
      isSending: args.isSending,
    },
    toastProps: {
      message: args.sendError,
      onDismiss: args.onDismissSendError,
    },
    currentUserName: args.currentUserName,
  };
}
