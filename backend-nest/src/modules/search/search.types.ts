import { MessageResponse } from '../messages/messages.types';

// Regular message shape plus the metadata the sidebar search list needs.
export interface MessageSearchResultResponse extends MessageResponse {
  conversationTitle: string;
}

export interface MessageSearchResponse {
  results: MessageSearchResultResponse[];
  nextCursor: string | null;
}

export interface RecentSearchesResponse {
  searches: string[];
}
