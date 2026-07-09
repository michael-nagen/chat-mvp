import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConversationsRepository } from './conversations.repository';
import { Conversation, ConversationType } from '../../common/storage/entities';
import { TxContext } from '../../common/storage/unit-of-work';
import { ConflictException } from '../../common/errors/app.exception';
import { toConversationKey } from './conversation-key';
import { CreateDmResult } from './conversations.types';

@Injectable()
export class ConversationsService {
  constructor(private readonly repo: ConversationsRepository) {}

  getForUser(userId: string): Promise<Conversation[]> {
    return this.repo.getForUser(userId);
  }

  // Get-or-create keyed on the conversation identity. The DM uniqueness index
  // is the real guarantee; the pre-check is the fast path and the catch handles
  // the concurrent-create race, both resolving to the existing DM.
  async createDm({
    participantIds,
    title,
  }: {
    participantIds: string[];
    title: string;
  }): Promise<CreateDmResult> {
    const conversationKey = toConversationKey({ type: 'dm', participantIds });
    const existing = await this.repo.findByConversationKey(conversationKey);
    if (existing) {
      return { conversation: existing, alreadyExisted: true };
    }
    try {
      const conversation = await this.repo.insert(
        this.build({ participantIds, title, type: 'dm' }),
      );
      return { conversation, alreadyExisted: false };
    } catch (error) {
      if (error instanceof ConflictException) {
        const raced = await this.repo.findByConversationKey(conversationKey);
        if (raced) {
          return { conversation: raced, alreadyExisted: true };
        }
      }
      throw error;
    }
  }

  createGroup({
    participantIds,
    title,
  }: {
    participantIds: string[];
    title: string;
  }): Promise<Conversation> {
    return this.repo.insert(this.build({ participantIds, title, type: 'group' }));
  }
createAssistant({
    userId,
    title,
    assistantId,
  }: {
    userId: string;
    title: string;
    assistantId: string;
  }): Promise<Conversation> {
    return this.repo.insert(
      this.build({
        participantIds: [userId, assistantId],
        title,
        type: 'assistant',
      }),
    );
  }

  createTutor({
    userId,
    title,
    assistantId,
  }: {
    userId: string;
    title: string;
    assistantId: string;
  }): Promise<Conversation> {
    return this.repo.insert(
      this.build({
        participantIds: [userId, assistantId],
        title,
        type: 'tutor',
      }),
    );
  }

  private build({
    participantIds,
    title,
    type,
  }: {
    participantIds: string[];
    title: string;
    type: ConversationType;
  }): Conversation {
    return {
      id: `c-${randomUUID()}`,
      title,
      participantIds,
      lastMessage: '',
      updatedAt: new Date().toISOString(),
      type,
      conversationKey: toConversationKey({ type, participantIds }),
    };
  }

  getById(id: string): Promise<Conversation | undefined> {
    return this.repo.findById(id);
  }

  updateLastMessage(
    {
      id,
      lastMessage,
      updatedAt,
    }: {
      id: string;
      lastMessage: string;
      updatedAt: string;
    },
    tx?: TxContext,
  ): Promise<Conversation | undefined> {
    return this.repo.updateLastMessage({ id, lastMessage, updatedAt }, tx);
  }
}
