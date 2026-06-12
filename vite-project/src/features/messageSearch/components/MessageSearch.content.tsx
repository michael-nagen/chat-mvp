import type { SearchStatus } from '../MessageSearch.types';
import type { MessageSearchController } from '../MessageSearch.use';
import { RecentSearches } from './RecentSearches';
import { SearchResults } from './SearchResults';
import { SearchSkeletonList } from './SearchSkeletonList';
import { SearchEmpty } from './SearchEmpty';
import { SearchError } from './SearchError';

export function selectSearchContent(controller: MessageSearchController): React.JSX.Element {
  const { state, selectRecent, selectResult } = controller;
  const recents = <RecentSearches searches={state.recentSearches} onSelect={selectRecent} />;
  const byStatus: Record<SearchStatus, React.JSX.Element> = {
    idle: recents,
    recents,
    loading: <SearchSkeletonList />,
    error: <SearchError error={state.error ?? 'Search failed'} />,
    results:
      state.results.length === 0 ? (
        <SearchEmpty query={state.query} />
      ) : (
        <SearchResults results={state.results} onSelect={selectResult} />
      ),
  };
  return byStatus[state.status];
}
