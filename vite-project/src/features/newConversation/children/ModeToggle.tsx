import { useNewConversation } from '../NewConversation.context';
import { newConversationStrings } from '../NewConversation.strings';
import { newConversationStyles } from '../NewConversation.styles';

/** Segmented DM | Group selector; the active mode is filled. */
export function ModeToggle(): React.JSX.Element {
  const { mode, setMode } = useNewConversation();

  return (
    <div style={newConversationStyles.segmentGroup}>
      <button
        type="button"
        onClick={() => setMode('dm')}
        style={newConversationStyles.segment(mode === 'dm')}
      >
        {newConversationStrings.modes.dm}
      </button>
      <button
        type="button"
        onClick={() => setMode('group')}
        style={newConversationStyles.segment(mode === 'group')}
      >
        {newConversationStrings.modes.group}
      </button>
    </div>
  );
}
