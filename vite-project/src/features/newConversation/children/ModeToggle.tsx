import { useNewConversation } from '../NewConversation.context';
import { newConversationStrings } from '../NewConversation.strings';
import { newConversationStyles } from '../NewConversation.styles';
import type { ConversationMode } from '../NewConversation.types';

const MODES: ConversationMode[] = ['dm', 'group', 'assistant', 'tutor'];

export function ModeToggle(): React.JSX.Element {
  const { mode, setMode } = useNewConversation();

  return (
    <div style={newConversationStyles.segmentGroup}>
      {MODES.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setMode(option)}
          style={newConversationStyles.segment(mode === option)}
        >
          {newConversationStrings.modes[option]}
        </button>
      ))}
    </div>
  );
}
