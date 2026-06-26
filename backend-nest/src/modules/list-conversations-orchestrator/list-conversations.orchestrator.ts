import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { UserService } from '../user/user.service';
import { AssistantRegistry } from '../assistant/assistant.registry';
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
    private readonly assistants: AssistantRegistry,
  ) {}

  async execute({
    userId,
  }: ListConversationsInput): Promise<ListConversationsOutput> {
    const conversations = await this.conversations.getForUser(userId);

   const userIds = [
      ...new Set(
        conversations
          .flatMap((c) => c.participantIds)
          .filter((id) => !this.assistants.isAssistant({ participantId: id })),
      ),
    ];
    const summaryById = new Map<string, UserSummary>(
      (await this.users.findByIds(userIds)).map((user) => [
        user.id,
        toUserSummary(user),
      ]),
    );

    const resolveParticipant = (id: string): UserSummary | undefined =>
      this.assistants.isAssistant({ participantId: id })
        ? this.assistants.summarize({ assistantId: id })
        : summaryById.get(id);

    return {
      conversations: conversations.map((conversation) =>
        toConversationResponse(
          conversation,
          conversation.participantIds
            .map(resolveParticipant)
            .filter((s): s is UserSummary => s !== undefined),
        ),
      ),
    };
  }
}
