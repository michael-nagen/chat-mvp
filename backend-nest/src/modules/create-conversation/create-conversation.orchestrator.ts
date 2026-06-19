import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { UserService } from '../user/user.service';
import { toConversationResponse } from '../conversations/conversations.mapper';
import { toUserSummary } from '../user/user.mapper';
import {
  ConflictException,
  NotFoundException,
} from '../../common/errors/app.exception';
import type {
  CreateConversationInput,
  CreateConversationOutput,
} from './create-conversation.module';

@Injectable()
export class CreateConversationOrchestrator {
  constructor(
    private readonly conversations: ConversationsService,
    private readonly users: UserService,
  ) {}

  async run({
    email,
    userId,
  }: CreateConversationInput): Promise<CreateConversationOutput> {
    const recipient = await this.users.findByEmail(email);
    if (!recipient) {
      throw new NotFoundException('User not found.');
    }
    if (
      await this.conversations.findBetween({
        userId,
        recipientId: recipient.id,
      })
    ) {
      throw new ConflictException('Conversation already exists.');
    }
    const conversation = await this.conversations.create({
      participantIds: [userId, recipient.id],
      title: recipient.email,
    });
    const participants = (
      await this.users.findByIds(conversation.participantIds)
    ).map(toUserSummary);
    return toConversationResponse(conversation, participants);
  }
}
