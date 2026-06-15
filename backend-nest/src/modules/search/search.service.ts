import { Inject, Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { MessagesService } from '../messages/messages.service';
import { RECENT_SEARCHES_STORE, RecentSearchesStore } from './recent-searches.store';
import { MessageSearchResponse, RecentSearchesResponse } from './search.types';

@Injectable()
export class SearchService {
  constructor(
    private readonly conversations: ConversationsService,
    private readonly messages: MessagesService,
    @Inject(RECENT_SEARCHES_STORE) private readonly recent: RecentSearchesStore,
  ) {}

  async searchMessages({
    userId,
    query,
    cursor,
    limit,
  }: {
    userId: string;
    query: string;
    cursor?: string;
    limit: number;
  }): Promise<MessageSearchResponse> {
    const term = query.trim();
    if (!term) {
      return { results: [], nextCursor: null };
    }

    // Restrict to the caller's conversations, then match message content.
    const titleById = new Map(
      this.conversations.getForUser(userId).map((c) => [c.id, c.title]),
    );

    const { messages, nextCursor } = this.messages.searchContent({
      conversationIds: new Set(titleById.keys()),
      query: term,
      cursor,
      limit,
    });
    const results = messages.map((m) => ({
      ...m,
      conversationTitle: titleById.get(m.conversationId) ?? '',
    }));

    // Persist only on a fresh search (first page), never per keystroke or per page.
    if (!cursor) {
      await this.recent.addRecent({ userId, query: term });
    }
    return { results, nextCursor };
  }

  async getRecent({ userId }: { userId: string }): Promise<RecentSearchesResponse> {
    return { searches: await this.recent.getRecent({ userId }) };
  }
}
