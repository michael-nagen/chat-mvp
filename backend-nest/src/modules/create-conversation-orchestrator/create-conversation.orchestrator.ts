import { Injectable } from '@nestjs/common';
import { CreateDmOrchestrator } from '../create-dm-orchestrator/create-dm.orchestrator';
import { CreateGroupOrchestrator } from '../create-group-orchestrator/create-group.orchestrator';
import { CreateAssistantConversationOrchestrator } from '../create-assistant-conversation-orchestrator/create-assistant-conversation.orchestrator';
import { CreateTutorConversationOrchestrator } from '../create-tutor-conversation-orchestrator/create-tutor-conversation.orchestrator';
import type {
  CreateConversationInput,
  CreateConversationOutput,
} from './create-conversation.module';

// Routes a unified create request to the type-specific orchestrator that owns
// the real business logic, and normalizes every result to the same
// { conversation, alreadyExisted } shape so the controller stays uniform.
@Injectable()
export class CreateConversationOrchestrator {
  constructor(
    private readonly createDm: CreateDmOrchestrator,
    private readonly createGroup: CreateGroupOrchestrator,
    private readonly createAssistant: CreateAssistantConversationOrchestrator,
    private readonly createTutor: CreateTutorConversationOrchestrator,
  ) {}

  async execute({
    userId,
    type,
    contactIds,
    title,
  }: CreateConversationInput): Promise<CreateConversationOutput> {
    switch (type) {
      case 'dm': {
        const { conversation, alreadyExisted } = await this.createDm.execute({
          requestedIds: contactIds ?? [],
          userId,
        });
        return { conversation, alreadyExisted };
      }
      case 'group': {
        const conversation = await this.createGroup.execute({
          requestedIds: contactIds ?? [],
          userId,
          title,
        });
        return { conversation, alreadyExisted: false };
      }
      case 'assistant': {
        const conversation = await this.createAssistant.execute({
          userId,
          title,
        });
        return { conversation, alreadyExisted: false };
      }
      case 'tutor': {
        const conversation = await this.createTutor.execute({ userId });
        return { conversation, alreadyExisted: false };
      }
    }
  }
}
