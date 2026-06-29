import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { MessagesService } from '../messages/messages.service';
import { RecentSearchesService } from '../recent-searches/recent-searches.service';
import { toMessageResponse } from '../messages/messages.mapper';
import type { SearchMessagesInput, SearchMessagesOutput } from './search-messages.module';

@Injectable()
export class SearchMessagesOrchestrator {
  constructor(
    private readonly conversations: ConversationsService,
    private readonly messages: MessagesService,
    private readonly recentSearches: RecentSearchesService,
  ) {}

  async execute({ userId, query, cursor, limit }: SearchMessagesInput): Promise<SearchMessagesOutput> {
    const term = query.trim();
    if (!term) {
      return { results: [], nextCursor: null };
    }

    // Restrict to the caller's conversations, then match message content.
    const conversations = await this.conversations.getForUser(userId);
    const titleById = new Map(conversations.map((c) => [c.id, c.title]));

    const { items, nextCursor } = await this.messages.searchContent({
      conversationIds: new Set(titleById.keys()),
      query: term,
      cursor,
      limit,
    });
    const results = items.map((m) => ({
      ...toMessageResponse(m),
      conversationTitle: titleById.get(m.conversationId) ?? '',
    }));

    // Persist only on a fresh search (first page), never per keystroke or per page.
    if (!cursor) {
      await this.recentSearches.add({ userId, query: term });
    }
    return { results, nextCursor };
  }
}
