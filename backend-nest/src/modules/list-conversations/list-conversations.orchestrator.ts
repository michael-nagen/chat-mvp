import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { toConversationResponse } from '../conversations/conversations.mapper';
import type {
  ListConversationsInput,
  ListConversationsOutput,
} from './list-conversations.module';

@Injectable()
export class ListConversationsOrchestrator {
  constructor(private readonly conversations: ConversationsService) {}

  async run({
    userId,
  }: ListConversationsInput): Promise<ListConversationsOutput> {
    const conversations = await this.conversations.getForUser(userId);
    return {
      conversations: conversations.map(toConversationResponse),
    };
  }
}
