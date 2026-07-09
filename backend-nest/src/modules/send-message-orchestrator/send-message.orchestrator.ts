import { Injectable } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { ConversationsService } from '../conversations/conversations.service';
import {
  ConversationNotFoundException,
  ForbiddenException,
} from '../../common/errors/app.exception';
import { UnitOfWork } from '../../common/storage/unit-of-work';
import { toMessageResponse } from '../messages/messages.mapper';
import { RagTutorService } from '../rag-tutor/rag-tutor.service';
import { TUTOR_ASSISTANT_ID } from '../assistant/assistant.catalog';
import type { SendMessageInput, SendMessageOutput } from './send-message.module';

@Injectable()
export class SendMessageOrchestrator {
  constructor(
    private readonly messages: MessagesService,
    private readonly conversations: ConversationsService,
    private readonly ragTutor: RagTutorService,
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
    // Write the user message AND bump the conversation preview atomically: the
    // UnitOfWork owns the transaction boundary; the DB driver owns the mechanics.
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

    if (conversation.type === 'tutor') {
      await this.replyAsTutor({ conversationId, userId, question: content });
    }

    return { message: toMessageResponse(message) };
  }

  private async replyAsTutor({
    conversationId,
    userId,
    question,
  }: {
    conversationId: string;
    userId: string;
    question: string;
  }): Promise<void> {
    // Persist the grounded answer plus its citations as assistant-message
    // metadata. Fallback answers have no citations, so metadata is omitted.
    const { answer, citations } = await this.ragTutor.answerQuestion({
      userId,
      question,
    });
    const metadata = citations.length > 0 ? { citations } : undefined;
    await this.unitOfWork.run(async (tx) => {
      const reply = await this.messages.create(
        { conversationId, userId: TUTOR_ASSISTANT_ID, content: answer, metadata },
        tx,
      );
      await this.conversations.updateLastMessage(
        { id: conversationId, lastMessage: answer, updatedAt: reply.createdAt },
        tx,
      );
    });
  }
}
