import { useNewConversation } from '../NewConversation.context';
import { newConversationStrings } from '../NewConversation.strings';
import { newConversationStyles } from '../NewConversation.styles';
import { ModeToggle } from './ModeToggle';
import { ContactList } from './ContactList';

/** Step 1: choose conversation type and contacts. */
export function SelectParticipantsStep(): React.JSX.Element {
  const { mode, canCreate, canContinue, isCreating, submit, continueToTitle } =
    useNewConversation();
  const isDm = mode === 'dm';
  const enabled = (isDm ? canCreate : canContinue) && !isCreating;

  return (
    <>
      <ModeToggle />
      <ContactList />
      <button
        type="button"
        disabled={!enabled}
        onClick={isDm ? () => void submit() : continueToTitle}
        style={newConversationStyles.primaryButton(enabled)}
      >
        {isDm ? newConversationStrings.create : newConversationStrings.continue}
      </button>
    </>
  );
}
