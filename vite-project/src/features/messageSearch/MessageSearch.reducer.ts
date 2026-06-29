import type { MessageSearchAction, MessageSearchState } from './MessageSearch.types';
import { RECENT_SEARCH_LIMIT } from './MessageSearch.constants';

export const initialMessageSearchState: MessageSearchState = {
  isSearchMode: false,
  query: '',
  recentSearches: [],
  results: [],
  status: 'idle',
  error: null,
};

// Optimistic local update; the backend will own real persistence later.
function prependRecent({ list, value }: { list: string[]; value: string }): string[] {
  const trimmed = value.trim();
  const withoutDupe = list.filter((item) => item !== trimmed);
  return [trimmed, ...withoutDupe].slice(0, RECENT_SEARCH_LIMIT);
}

export function messageSearchReducer(
  state: MessageSearchState,
  action: MessageSearchAction,
): MessageSearchState {
  switch (action.type) {
    case 'FOCUS':
      return { ...state, isSearchMode: true, status: state.status === 'idle' ? 'recents' : state.status };
    case 'SET_QUERY':
      // Search is submit-driven; typing only rewinds to recents, never queries.
      return { ...state, query: action.query, status: 'recents' };
    case 'RECENTS_LOADED':
      return { ...state, recentSearches: action.searches };
    case 'SUBMIT_START':
      return {
        ...state,
        query: action.query,
        status: 'loading',
        error: null,
        recentSearches: prependRecent({ list: state.recentSearches, value: action.query }),
      };
    case 'SUBMIT_SUCCESS':
      return { ...state, status: 'results', results: action.results };
    case 'SUBMIT_ERROR':
      return { ...state, status: 'error', error: action.error, results: [] };
    case 'EXIT':
      return { ...state, isSearchMode: false, status: 'idle', query: '', results: [], error: null };
    default:
      return state;
  }
}
