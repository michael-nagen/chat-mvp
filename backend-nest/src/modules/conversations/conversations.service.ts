import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConversationsRepository } from './conversations.repository';
import { UserService } from '../user/user.service';
import { Conversation } from '../../common/store/entities';
import {
  ConflictException,
  NotFoundException,
} from '../../common/errors/app.exception';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly repo: ConversationsRepository,
    private readonly users: UserService,
  ) {}

  getForUser(userId: string): Conversation[] {
    return this.repo
      .getForUser(userId)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }

  create({ email, userId }: { email: string; userId: string }): Conversation {
    const recipient = this.users.findByEmail(email);
    if (!recipient) {
      throw new NotFoundException('User not found.');
    }
    if (this.repo.findBetween(userId, recipient.id)) {
      throw new ConflictException('Conversation already exists.');
    }
    const conversation: Conversation = {
      id: `c-${randomUUID()}`,
      title: recipient.email,
      participantIds: [userId, recipient.id],
      lastMessage: '',
      updatedAt: new Date().toISOString(),
    };
    return this.repo.insert(conversation);
  }

  getById(id: string): Conversation | undefined {
    return this.repo.findById(id);
  }

  updateLastMessage({
    id,
    lastMessage,
    updatedAt,
  }: {
    id: string;
    lastMessage: string;
    updatedAt: string;
  }): Conversation | undefined {
    return this.repo.updateLastMessage({ id, lastMessage, updatedAt });
  }
}
