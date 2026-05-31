import { useCallback, useEffect, useState } from 'react';
import type { Conversation, Message, User } from '../shared/contract/contract';
import type { ChatPageViewProps } from './ChatPage.types';
import { getConversations, getMessages, sendMessage } from '../shared/chatApi/apiClient';
import { buildChatPageViewProps } from './ChatPage.logic';

/** Manages all chat page state: conversation list, messages, composer, and send with optimistic updates. */
export function useChatPage(args: { currentUser: User }): ChatPageViewProps {
  const { currentUser } = args;
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [conversationsError, setConversationsError] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  const [composerValue, setComposerValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const dismissSendError = useCallback((): void => setSendError(null), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingConversations(true);
    setConversationsError(null);
    getConversations(currentUser.id)
      .then((res) => {
        if (cancelled) return;
        setConversations(res.conversations);
        setIsLoadingConversations(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setConversationsError(err instanceof Error ? err.message : 'Failed to load conversations');
        setIsLoadingConversations(false);
      });
    return () => {
      cancelled = true;
    };
  }, [currentUser.id]);

  useEffect(() => {
    setComposerValue('');
    if (!selectedConversationId) {
      setMessages([]);
      setMessagesError(null);
      setIsLoadingMessages(false);
      return;
    }
    let cancelled = false;
    setIsLoadingMessages(true);
    setMessagesError(null);
    getMessages(selectedConversationId)
      .then((res) => {
        if (cancelled) return;
        setMessages(res.messages);
        setIsLoadingMessages(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setMessagesError(err instanceof Error ? err.message : 'Failed to load messages');
        setIsLoadingMessages(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedConversationId]);

  async function handleSend(): Promise<void> {
    if (!selectedConversationId || isSending) return;
    const trimmed = composerValue.trim();
    if (!trimmed) return;

    const conversationId = selectedConversationId;
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      conversationId,
      sender: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    // optimistic insert: show the message immediately and clear the composer
    setMessages((prev) => [...prev, optimisticMessage]);
    setComposerValue('');
    setIsSending(true);

    try {
      const res = await sendMessage(conversationId, trimmed);
      // confirm: swap the temp message for the real one
      setMessages((prev) => prev.map((m) => (m.id === tempId ? res.message : m)));
    } catch (err) {
      // rollback: drop the temp message, restore the draft, surface a toast
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setComposerValue(trimmed);
      setSendError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  }

  return buildChatPageViewProps({
    conversations,
    isLoadingConversations,
    conversationsError,
    selectedConversationId,
    onSelectConversation: setSelectedConversationId,
    messages,
    isLoadingMessages,
    messagesError,
    composerValue,
    isSending,
    onComposerChange: setComposerValue,
    onComposerSend: handleSend,
    currentUserName: currentUser.name,
    sendError,
    onDismissSendError: dismissSendError,
  });
}
