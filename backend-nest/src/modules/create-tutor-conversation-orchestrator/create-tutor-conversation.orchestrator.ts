import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { ConversationParticipantsResolver } from '../conversation-participants-resolver/conversation-participants.resolver';
import { toConversationResponse } from '../conversations/conversations.mapper';
import { AssistantRegistry } from '../assistant/assistant.registry';
import { TUTOR_ASSISTANT_ID } from '../assistant/assistant.catalog';
import type {
  CreateTutorConversationInput,
  CreateTutorConversationOutput,
} from './create-tutor-conversation.module';

const TUTOR_TITLE = 'RAG Tutor';

// Creates a single-user tutor conversation, mirroring the assistant flow: the
// tutor's built-in identity is the only other participant. Retrieval-augmented
// answering arrives in Part 6; this only establishes the conversation.
@Injectable()
export class CreateTutorConversationOrchestrator {
  constructor(
    private readonly conversations: ConversationsService,
    private readonly participantsResolver: ConversationParticipantsResolver,
    private readonly assistants: AssistantRegistry,
  ) {}

  async execute({
    userId,
  }: CreateTutorConversationInput): Promise<CreateTutorConversationOutput> {
    const { participants } = await this.participantsResolver.resolve({
      requestedIds: [],
      currentUserId: userId,
      min: 0,
      max: 0,
    });
    const conversation = await this.conversations.createTutor({
      userId,
      title: TUTOR_TITLE,
      assistantId: TUTOR_ASSISTANT_ID,
    });
    const tutor = this.assistants.summarize({ assistantId: TUTOR_ASSISTANT_ID });
    return toConversationResponse(conversation, [...participants, tutor]);
  }
}
