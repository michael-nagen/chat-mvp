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
    // Persist only the user message here. AI replies (assistant and tutor) are
    // generated and persisted exactly once by the streaming path, so this write
    // is identical for every conversation type.
    const message = await this.unitOfWork.run(async (tx) => {
      const created = await this.messages.create(
        { conversationId, userId, content },
        tx,
      );
      await this.conversations.updateLastMessage(
        {
          id: conversationId,
          lastMessage: content,
          updatedAt: created.createdAt,
        },
        tx,
      );
      return created;
    });

    return { message: toMessageResponse(message) };
  }
}
