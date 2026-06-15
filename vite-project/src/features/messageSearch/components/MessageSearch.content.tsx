import { useMessageSearchContext } from '../MessageSearch.context';
import { RecentSearches } from './RecentSearches';
import { SearchResults } from './SearchResults';
import { SearchSkeletonList } from './SearchSkeletonList';
import { SearchEmpty } from './SearchEmpty';
import { SearchError } from './SearchError';

export function MessageSearchContent(): React.JSX.Element {
  const { state, selectRecent, selectResult } = useMessageSearchContext();
  switch (state.status) {
    case 'loading':
      return <SearchSkeletonList />;
    case 'error':
      return <SearchError error={state.error ?? 'Search failed'} />;
    case 'results':
      return state.results.length === 0 ? (
        <SearchEmpty query={state.query} />
      ) : (
        <SearchResults results={state.results} onSelect={selectResult} />
      );
    case 'idle':
    case 'recents':
    default:
      return <RecentSearches searches={state.recentSearches} onSelect={selectRecent} />;
  }
}
