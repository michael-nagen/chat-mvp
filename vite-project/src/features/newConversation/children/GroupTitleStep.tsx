import { TextField } from '../../../shared/components/TextField';
import { useNewConversation } from '../NewConversation.context';
import { newConversationStrings } from '../NewConversation.strings';
import { newConversationStyles } from '../NewConversation.styles';
import { SelectedParticipants } from './SelectedParticipants';

/** Step 2: name the group. */
export function GroupTitleStep(): React.JSX.Element {
  const { groupTitle, setGroupTitle, canCreate, isCreating, submit, back } =
    useNewConversation();
  const enabled = canCreate && !isCreating;

  return (
    <>
      <SelectedParticipants />
      <TextField
        type="text"
        value={groupTitle}
        onChange={setGroupTitle}
        placeholder={newConversationStrings.groupNamePlaceholder}
        autoComplete="off"
        disabled={isCreating}
        autoFocus
      />
      <div style={newConversationStyles.footerRow}>
        <button
          type="button"
          onClick={back}
          style={newConversationStyles.secondaryButton}
        >
          {newConversationStrings.back}
        </button>
        <button
          type="button"
          disabled={!enabled}
          onClick={() => void submit()}
          style={newConversationStyles.primaryButton(enabled)}
        >
          {newConversationStrings.create}
        </button>
      </div>
    </>
  );
}
