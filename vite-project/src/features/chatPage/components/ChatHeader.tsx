import { chatPageStyles } from './ChatPage.styles';
import { useAuth } from '../../auth';
import { useChatSelection } from '../ChatSelection.context';
import { Avatar } from '../../../shared/components/Avatar';

/** Conversation header — the other participant's name + avatar (title/email fallback). */
export function ChatHeader(): React.JSX.Element | null {
  const { user } = useAuth();
  const { selectedConversation } = useChatSelection();

  if (!selectedConversation) return null;

  const other = selectedConversation.participants.find((p) => p.id !== user?.id);
  const name = other?.displayName || selectedConversation.title;

  return (
    <div style={chatPageStyles.header}>
      <Avatar src={other?.avatarUrl ?? null} name={name} size={32} />
      <span style={chatPageStyles.headerName}>{name}</span>
    </div>
  );
}
