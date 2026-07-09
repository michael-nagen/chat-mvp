import { Module } from '@nestjs/common';
import { MessagesModule, MESSAGES_DRIVER } from '../messages/messages.module';
import { MessageResponse } from '../messages/messages.types';
import {
  ConversationsModule,
  CONVERSATIONS_DRIVER,
} from '../conversations/conversations.module';
import { unitOfWorkProvider } from '../../common/storage/storage.config';
import { SendMessageOrchestrator } from './send-message.orchestrator';

export interface SendMessageInput {
  conversationId: string;
  userId: string;
  content: string;
}

export interface SendMessageOutput {
  message: MessageResponse;
}

@Module({
  imports: [MessagesModule, ConversationsModule],
  providers: [
    SendMessageOrchestrator,
    unitOfWorkProvider([MESSAGES_DRIVER, CONVERSATIONS_DRIVER]),
  ],
  exports: [SendMessageOrchestrator],
})
export class SendMessageModule {}
