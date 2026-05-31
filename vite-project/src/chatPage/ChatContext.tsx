import { createContext, useCallback, useContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Message } from '../shared/contract/contract';

type ChatContextValue = {
  /** The conversation currently open in the thread pane, or null if none. */
  selectedConversationId: string | null;
  /** Switch to a conversation — also clears the current message thread. */
  selectConversation: (id: string) => void;
  /** Messages for the selected conversation, shared between MessageList and MessageComposer. */
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  /** Non-null when the last send attempt failed; consumed by Toast. */
  sendError: string | null;
  setSendError: Dispatch<SetStateAction<string | null>>;
};

const ChatContext = createContext<ChatContextValue | null>(null);

/** Access the shared chat state from any component inside ChatProvider. */
export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used inside ChatProvider');
  return ctx;
}

/** Provides shared chat state to the conversation list, thread, composer, and toast. */
export function ChatProvider({ children }: { children: ReactNode }) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendError, setSendError] = useState<string | null>(null);

  const selectConversation = useCallback((id: string): void => {
    setSelectedConversationId(id);
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider value={{
      selectedConversationId,
      selectConversation,
      messages,
      setMessages,
      sendError,
      setSendError,
    }}>
      {children}
    </ChatContext.Provider>
  );
}
