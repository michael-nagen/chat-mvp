import { SKELETON_WIDTHS } from './Message.constants';
import { messageStyles } from './Message.styles';

/** Animated placeholder bubbles shown while the message thread is loading. */
export function MessageSkeletonList(): React.JSX.Element {
  return (
    <div style={messageStyles.skeletonList} aria-busy="true" aria-label="Loading messages">
      {SKELETON_WIDTHS.map((width, i) => (
        <div
          key={i}
          className="skeleton"
          style={messageStyles.skeletonBubble(i, width)}
        />
      ))}
    </div>
  );
}
