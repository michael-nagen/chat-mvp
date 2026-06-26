import { useNewConversation } from '../NewConversation.context';
import { newConversationStrings } from '../NewConversation.strings';
import { newConversationStyles } from '../NewConversation.styles';
import { ModeToggle } from './ModeToggle';


export function AssistantStep(): React.JSX.Element {
  const { canCreate, isCreating, submit } = useNewConversation();
  const enabled = canCreate && !isCreating;

  return (
    <>
      <ModeToggle />
      <p style={newConversationStyles.notice}>
        {newConversationStrings.assistantDescription}
      </p>
      <button
        type="button"
        disabled={!enabled}
        onClick={() => void submit()}
        style={newConversationStyles.primaryButton(enabled)}
      >
        {newConversationStrings.create}
      </button>
    </>
  );
}
