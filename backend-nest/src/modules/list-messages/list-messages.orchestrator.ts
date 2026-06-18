import { Injectable } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { ConversationsService } from '../conversations/conversations.service';
import {
  ConversationNotFoundException,
  ForbiddenException,
} from '../../common/errors/app.exception';
import { toMessagePageResponse } from '../messages/messages.mapper';
import type { ListMessagesInput, ListMessagesOutput } from './list-messages.module';

@Injectable()
export class ListMessagesOrchestrator {
  constructor(
    private readonly messages: MessagesService,
    private readonly conversations: ConversationsService,
  ) {}

  async run({
    conversationId,
    userId,
    cursor,
    limit,
  }: ListMessagesInput): Promise<ListMessagesOutput> {
    // Unknown conversation → 404; a real conversation the caller isn't part of → 403.
    const conversation = await this.conversations.getById(conversationId);
    if (!conversation) {
      throw new ConversationNotFoundException();
    }
    if (!conversation.participantIds.includes(userId)) {
      throw new ForbiddenException('You are not a participant in this conversation.');
    }
    const { items, nextCursor } = await this.messages.listPage({
      conversationId,
      cursor,
      limit,
    });
    return toMessagePageResponse(items, nextCursor);
  }
}
