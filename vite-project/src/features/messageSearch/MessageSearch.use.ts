import { useCallback, useEffect, useReducer } from 'react';
import type { MessageSearchResult, MessageSearchState } from './MessageSearch.types';
import { useChatSelection } from '../chatPage/ChatSelection.context';
import { getRecentSearches, searchMessages } from './MessageSearch.api';
import { initialMessageSearchState, messageSearchReducer } from './MessageSearch.reducer';

export type MessageSearchContextValue = {
  state: MessageSearchState;
  focus: () => void;
  setQuery: (value: string) => void;
  submit: () => void;
  selectRecent: (value: string) => void;
  selectResult: (result: MessageSearchResult) => void;
  exit: () => void;
};

/** Owns search-mode state, recents loading, submit-driven searching, and result selection. */
export function useMessageSearch(): MessageSearchContextValue {
  const [state, dispatch] = useReducer(messageSearchReducer, initialMessageSearchState);
  const { selectConversation } = useChatSelection();

  // Load recents once whenever the user (re)enters search mode.
  useEffect(() => {
    if (!state.isSearchMode) return;
    let cancelled = false;
    getRecentSearches()
      .then((res) => {
        if (!cancelled) dispatch({ type: 'RECENTS_LOADED', searches: res.searches });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [state.isSearchMode]);

  const runSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    dispatch({ type: 'SUBMIT_START', query: trimmed });
    searchMessages({ query: trimmed })
      .then((res) => dispatch({ type: 'SUBMIT_SUCCESS', results: res.results }))
      .catch((err) =>
        dispatch({
          type: 'SUBMIT_ERROR',
          error: err instanceof Error ? err.message : 'Search failed',
        }),
      );
  }, []);

  const focus = useCallback(() => dispatch({ type: 'FOCUS' }), []);
  const setQuery = useCallback((value: string) => dispatch({ type: 'SET_QUERY', query: value }), []);
  const submit = useCallback(() => runSearch(state.query), [runSearch, state.query]);
  const selectRecent = useCallback(
    (value: string) => {
      dispatch({ type: 'SET_QUERY', query: value });
      runSearch(value);
    },
    [runSearch],
  );
  const exit = useCallback(() => dispatch({ type: 'EXIT' }), []);
  const selectResult = useCallback(
    (result: MessageSearchResult) => {
      selectConversation(result.conversationId);
      dispatch({ type: 'EXIT' });
    },
    [selectConversation],
  );

  return { state, focus, setQuery, submit, selectRecent, selectResult, exit };
}
