import { useState } from 'react';
import type { ReactNode } from 'react';
import { NewConversationContext } from './NewConversation.context';
import { useChatSelection } from '../chatPage/ChatSelection.context';
import { useToast } from '../toast';
import { createConversation } from '../conversationList/ConversationList.api';

/** Holds the new-conversation state so each control can read it directly from context. */
export function NewConversationProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const { selectConversation, refreshConversations } = useChatSelection();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const submittable = email.trim().length > 0 && !isCreating;

  function open(): void {
    setIsOpen(true);
  }

  function cancel(): void {
    setIsOpen(false);
    setEmail('');
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!submittable) return;
    setIsCreating(true);
    try {
      const conversation = await createConversation(email.trim());
      refreshConversations();
      selectConversation(conversation.id, conversation);
      cancel();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create conversation');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <NewConversationContext.Provider
      value={{ isOpen, email, isCreating, submittable, onEmailChange: setEmail, open, cancel, onSubmit }}
    >
      {children}
    </NewConversationContext.Provider>
  );
}
