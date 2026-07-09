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

// Routing instruction the send path returns to its caller: dm/group need no AI
// reply; assistant/tutor should have the AI stream started for them. Generation
// and persistence of that reply stay in StreamAssistantReplyOrchestrator.
export type SendMessageAiReply =
  | { required: false }
  | { required: true; conversationType: 'assistant' | 'tutor' };

export interface SendMessageOutput {
  message: MessageResponse;
  aiReply: SendMessageAiReply;
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
