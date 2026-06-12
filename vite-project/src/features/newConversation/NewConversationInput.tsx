import { chatPageStyles } from '../chatPage/components/ChatPage.styles';
import { useNewConversation } from './NewConversation.context';

/** Recipient email field; cancels when blurred while empty. */
export function NewConversationInput(): React.JSX.Element {
  const { email, isCreating, onEmailChange, cancel } = useNewConversation();

  return (
    <input
      type="email"
      value={email}
      onChange={(e) => onEmailChange(e.target.value)}
      placeholder="Recipient email"
      autoFocus
      disabled={isCreating}
      onBlur={() => !email && cancel()}
      style={chatPageStyles.newInput}
    />
  );
}
