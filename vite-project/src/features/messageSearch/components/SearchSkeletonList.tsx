import { SEARCH_SKELETON_COUNT } from '../MessageSearch.constants';
import { messageSearchStyles } from './MessageSearch.styles';

/** Animated placeholder rows shown while a search is running. */
export function SearchSkeletonList(): React.JSX.Element {
  return (
    <div style={messageSearchStyles.column} aria-busy="true" aria-label="Searching messages">
      {Array.from({ length: SEARCH_SKELETON_COUNT }).map((_, i) => (
        <div key={i} style={messageSearchStyles.skeletonRow}>
          <div className="skeleton" style={messageSearchStyles.skeletonTitle} />
          <div className="skeleton" style={messageSearchStyles.skeletonSnippet} />
        </div>
      ))}
    </div>
  );
}
