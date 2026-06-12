import { get } from '../../shared/api/apiClient';
import type { MessageSearchResponse, RecentSearchesResponse } from './MessageSearch.types';

export function getRecentSearches(): Promise<RecentSearchesResponse> {
  return get<RecentSearchesResponse>('/search/recent');
}

export function searchMessages({ query }: { query: string }): Promise<MessageSearchResponse> {
  return get<MessageSearchResponse>('/messages/search', { query: { q: query } });
}
