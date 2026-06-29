import type { RecentSearchesProps } from '../MessageSearch.types';
import { messageSearchStyles } from './MessageSearch.styles';

/** The user's recent searches; clicking one runs that search immediately. */
export function RecentSearches({ searches, onSelect }: RecentSearchesProps): React.JSX.Element {
  if (searches.length === 0) {
    return <div style={messageSearchStyles.center}>No recent searches</div>;
  }

  return (
    <div style={messageSearchStyles.column}>
      {searches.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          style={messageSearchStyles.recentRow}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
