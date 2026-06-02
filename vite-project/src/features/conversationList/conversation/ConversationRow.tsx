import { ConversationRowProvider } from './ConversationRowProvider';
import { ConversationRowContainer } from './ConversationRowContainer';
import type { ConversationRowProps } from './ConversationRow.types';

export function ConversationRow({ conversation }: ConversationRowProps): React.JSX.Element {
  return (
    <ConversationRowProvider conversation={conversation}>
      <ConversationRowContainer />
    </ConversationRowProvider>
  );
}
