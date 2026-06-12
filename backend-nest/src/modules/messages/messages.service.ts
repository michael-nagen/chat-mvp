import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { ConversationsService } from '../conversations/conversations.service';
import { Message } from '../../common/store/entities';
import {
  ConversationNotFoundException,
  ForbiddenException,
} from '../../common/errors/app.exception';
import { toMessagePageResponse, toMessageResponse } from './messages.mapper';
import { MessagePageResponse, MessageResponse } from './messages.types';

@Injectable()
export class MessagesService {
  constructor(
    private readonly repo: MessagesRepository,
    private readonly conversations: ConversationsService,
  ) {}

  list({
    conversationId,
    userId,
    cursor,
    limit,
  }: {
    conversationId: string;
    userId: string;
    cursor?: string;
    limit: number;
  }): MessagePageResponse {
    this.ensureAccess({ conversationId, userId });
    const rows = this.repo.findPage({ conversationId, cursor, limit });
    const hasMore = rows.length > limit;
    const messages = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? messages[messages.length - 1].id : null;
    return toMessagePageResponse(messages, nextCursor);
  }

  create({
    conversationId,
    userId,
    content,
  }: {
    conversationId: string;
    userId: string;
    content: string;
  }): MessageResponse {
    this.ensureAccess({ conversationId, userId });
    const message: Message = {
      id: `m-${randomUUID()}`,
      conversationId,
      senderId: userId,
      content,
      createdAt: new Date().toISOString(),
    };
    this.repo.insert(message);
    this.conversations.updateLastMessage({
      id: conversationId,
      lastMessage: content,
      updatedAt: message.createdAt,
    });
    return toMessageResponse(message);
  }

  // Unknown conversation → 404; a real conversation the caller isn't part of → 403.
  private ensureAccess({
    conversationId,
    userId,
  }: {
    conversationId: string;
    userId: string;
  }): void {
    const conversation = this.conversations.getById(conversationId);
    if (!conversation) {
      throw new ConversationNotFoundException();
    }
    if (!conversation.participantIds.includes(userId)) {
      throw new ForbiddenException('You are not a participant in this conversation.');
    }
  }
}
