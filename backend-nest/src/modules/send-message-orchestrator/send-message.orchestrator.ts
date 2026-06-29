import { Injectable } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { ConversationsService } from '../conversations/conversations.service';
import {
  ConversationNotFoundException,
  ForbiddenException,
} from '../../common/errors/app.exception';
import { UnitOfWork } from '../../common/storage/unit-of-work';
import { toMessageResponse } from '../messages/messages.mapper';
import type { SendMessageInput, SendMessageOutput } from './send-message.module';

@Injectable()
export class SendMessageOrchestrator {
  constructor(
    private readonly messages: MessagesService,
    private readonly conversations: ConversationsService,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute({
    conversationId,
    userId,
    content,
  }: SendMessageInput): Promise<SendMessageOutput> {
    // Unknown conversation → 404; a real conversation the caller isn't part of → 403.
    const conversation = await this.conversations.getById(conversationId);
    if (!conversation) {
      throw new ConversationNotFoundException();
    }
    if (!conversation.participantIds.includes(userId)) {
      throw new ForbiddenException('You are not a participant in this conversation.');
    }
    // Write the message AND bump the conversation preview atomically: the
    // UnitOfWork owns the transaction boundary; the DB driver owns the mechanics.
    return this.unitOfWork.run(async (tx) => {
      const message = await this.messages.create(
        { conversationId, userId, content },
        tx,
      );
      await this.conversations.updateLastMessage(
        {
          id: conversationId,
          lastMessage: content,
          updatedAt: message.createdAt,
        },
        tx,
      );
      return { message: toMessageResponse(message) };
    });
  }
}
