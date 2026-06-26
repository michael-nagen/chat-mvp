import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { ConversationParticipantsResolver } from '../conversation-participants-resolver/conversation-participants.resolver';
import { toConversationResponse } from '../conversations/conversations.mapper';
import { AssistantRegistry } from '../assistant/assistant.registry';
import { DEFAULT_ASSISTANT_ID } from '../assistant/assistant.catalog';
import type {
  CreateAssistantConversationInput,
  CreateAssistantConversationOutput,
} from './create-assistant-conversation.module';

const DEFAULT_ASSISTANT_TITLE = 'Assistant';

@Injectable()
export class CreateAssistantConversationOrchestrator {
  constructor(
    private readonly conversations: ConversationsService,
    private readonly participantsResolver: ConversationParticipantsResolver,
    private readonly assistants: AssistantRegistry,
  ) {}

  async execute({
    userId,
    title,
  }: CreateAssistantConversationInput): Promise<CreateAssistantConversationOutput> {
    const { participants } = await this.participantsResolver.resolve({
      requestedIds: [],
      currentUserId: userId,
      min: 0,
      max: 0,
    });
    const conversation = await this.conversations.createAssistant({
      userId,
      title: title ?? DEFAULT_ASSISTANT_TITLE,

      assistantId: DEFAULT_ASSISTANT_ID,
    });
    const assistant = this.assistants.summarize({
      assistantId: DEFAULT_ASSISTANT_ID,
    });
    return toConversationResponse(conversation, [...participants, assistant]);
  }
}
