import { SKELETON_COUNT } from './ConversationList.constants';
import { conversationListStyles } from './ConversationList.styles';

/** Animated placeholder rows shown while conversations are loading. */
export function ConversationSkeletonList(): React.JSX.Element {
  return (
    <div
      style={conversationListStyles.column}
      aria-busy="true"
      aria-label="Loading conversations"
    >
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={i} style={conversationListStyles.skeletonRow}>
          <div className="skeleton" style={conversationListStyles.skeletonTitle} />
          <div className="skeleton" style={conversationListStyles.skeletonPreview} />
        </div>
      ))}
    </div>
  );
}
