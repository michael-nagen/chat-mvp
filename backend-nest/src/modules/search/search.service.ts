import { Inject, Injectable } from '@nestjs/common';
import { toMessageResponse } from '../messages/messages.mapper';
import { SearchRepository } from './search.repository';
import { RECENT_SEARCHES_STORE, RecentSearchesStore } from './recent-searches.store';
import { MessageSearchResponse, RecentSearchesResponse } from './search.types';

@Injectable()
export class SearchService {
  constructor(
    private readonly repo: SearchRepository,
    @Inject(RECENT_SEARCHES_STORE) private readonly recent: RecentSearchesStore,
  ) {}

  async searchMessages({
    userId,
    query,
  }: {
    userId: string;
    query: string;
  }): Promise<MessageSearchResponse> {
    const term = query.trim();
    if (!term) {
      return { results: [] };
    }

    // Restrict to the caller's conversations, then match message content.
    const titleById = new Map(
      this.repo.conversationsForUser(userId).map((c) => [c.id, c.title]),
    );

    const results = this.repo
      .matchMessages({
        conversationIds: new Set(titleById.keys()),
        needle: term.toLowerCase(),
      })
      .map((m) => ({
        ...toMessageResponse(m),
        conversationTitle: titleById.get(m.conversationId) ?? '',
      }));

    // Persist only on a real search, never per keystroke.
    await this.recent.addRecent({ userId, query: term });
    return { results };
  }

  async getRecent({ userId }: { userId: string }): Promise<RecentSearchesResponse> {
    return { searches: await this.recent.getRecent({ userId }) };
  }
}
