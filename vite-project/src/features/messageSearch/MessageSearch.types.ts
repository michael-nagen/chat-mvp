import type { Message, RawMessage } from '../../shared/entities/Message.types';

/** Wire shape: recent search terms for the current user. */
export type RecentSearchesResponse = {
  searches: string[];
};

/** Wire shape: a search hit is a regular message plus the conversation title for the sidebar. */
export type MessageSearchResult = RawMessage & {
  conversationTitle: string;
};

/** Wire shape: message search results. */
export type MessageSearchResponse = {
  results: MessageSearchResult[];
};

/** Which content the swappable sidebar area is currently showing. */
export type SearchStatus = 'idle' | 'recents' | 'loading' | 'results' | 'error';

/** Reducer state for the message search lifecycle. */
export type MessageSearchState = {
  isSearchMode: boolean;
  query: string;
  recentSearches: string[];
  results: MessageSearchResult[];
  status: SearchStatus;
  error: string | null;
};

/** Actions dispatched across the search lifecycle. */
export type MessageSearchAction =
  | { type: 'FOCUS' }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'RECENTS_LOADED'; searches: string[] }
  | { type: 'SUBMIT_START'; query: string }
  | { type: 'SUBMIT_SUCCESS'; results: MessageSearchResult[] }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'EXIT' };

export type RecentSearchesProps = {
  searches: string[];
  onSelect: (value: string) => void;
};

export type SearchResultsProps = {
  results: MessageSearchResult[];
  onSelect: (result: MessageSearchResult) => void;
};

export type SearchResultRowProps = {
  conversationTitle: string;
  message: Message;
  onSelect: () => void;
};

export type SearchEmptyProps = {
  query: string;
};

export type SearchErrorProps = {
  error: string;
};
