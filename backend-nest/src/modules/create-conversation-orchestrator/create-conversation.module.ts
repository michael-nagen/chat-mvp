import { Module } from '@nestjs/common';
import { ConversationResponse } from '../conversations/conversations.types';
import { CreateConversationType } from '../conversations/dto/create-conversation.dto';
import { CreateDmModule } from '../create-dm-orchestrator/create-dm.module';
import { CreateGroupModule } from '../create-group-orchestrator/create-group.module';
import { CreateAssistantConversationModule } from '../create-assistant-conversation-orchestrator/create-assistant-conversation.module';
import { CreateTutorConversationModule } from '../create-tutor-conversation-orchestrator/create-tutor-conversation.module';
import { CreateConversationOrchestrator } from './create-conversation.orchestrator';

export interface CreateConversationInput {
  userId: string;
  type: CreateConversationType;
  // Other participants for dm/group; ignored for assistant.
  contactIds?: string[];
  // Optional client title (group/assistant); DM titles are always derived.
  title?: string;
}

export interface CreateConversationOutput {
  conversation: ConversationResponse;
  // True when an existing DM was returned (200) rather than created (201).
  // Always false for group/assistant, which never deduplicate.
  alreadyExisted: boolean;
}

@Module({
  imports: [
    CreateDmModule,
    CreateGroupModule,
    CreateAssistantConversationModule,
    CreateTutorConversationModule,
  ],
  providers: [CreateConversationOrchestrator],
  exports: [CreateConversationOrchestrator],
})
export class CreateConversationModule {}
