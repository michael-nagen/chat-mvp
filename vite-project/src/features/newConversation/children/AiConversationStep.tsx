import { useNewConversation } from '../NewConversation.context';
import { newConversationStrings } from '../NewConversation.strings';
import { newConversationStyles } from '../NewConversation.styles';
import { ModeToggle } from './ModeToggle';

// Shared step for the single-user AI conversation modes (assistant, tutor):
// no participant selection, just a description and a create button. The mode is
// switched via ModeToggle and the request type is derived from it on submit.
export function AiConversationStep({
  description,
}: {
  description: string;
}): React.JSX.Element {
  const { canCreate, isCreating, submit } = useNewConversation();
  const enabled = canCreate && !isCreating;

  return (
    <>
      <ModeToggle />
      <p style={newConversationStyles.notice}>{description}</p>
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
