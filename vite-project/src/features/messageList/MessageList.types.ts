import type { Message } from "../../shared/entities/Message.types";

/** Props for the MessageList view, including a flag to distinguish the empty-selection state. */
export type MessageListViewProps = {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  hasSelectedConversation: boolean;
};
