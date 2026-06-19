import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { UserService } from '../user/user.service';
import { toConversationResponse } from '../conversations/conversations.mapper';
import { toUserSummary } from '../user/user.mapper';
import { UserSummary } from '../user/user.types';
import type {
  ListConversationsInput,
  ListConversationsOutput,
} from './list-conversations.module';

@Injectable()
export class ListConversationsOrchestrator {
  constructor(
    private readonly conversations: ConversationsService,
    private readonly users: UserService,
  ) {}

  async run({
    userId,
  }: ListConversationsInput): Promise<ListConversationsOutput> {
    const conversations = await this.conversations.getForUser(userId);

    // One batched lookup covers every participant across all conversations.
    const ids = [...new Set(conversations.flatMap((c) => c.participantIds))];
    const summaryById = new Map<string, UserSummary>(
      (await this.users.findByIds(ids)).map((user) => [
        user.id,
        toUserSummary(user),
      ]),
    );

    return {
      conversations: conversations.map((conversation) =>
        toConversationResponse(
          conversation,
          conversation.participantIds
            .map((id) => summaryById.get(id))
            .filter((s): s is UserSummary => s !== undefined),
        ),
      ),
    };
  }
}
