import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { ConversationParticipantsResolver } from '../conversation-participants-resolver/conversation-participants.resolver';
import { toConversationResponse } from '../conversations/conversations.mapper';
import { deriveConversationTitle } from '../conversations/conversation-title';
import type { CreateDmInput, CreateDmOutput } from './create-dm.module';

const DM_MIN_OTHERS = 1;
const DM_MAX_OTHERS = 15;

@Injectable()
export class CreateDmOrchestrator {
  constructor(
    private readonly conversations: ConversationsService,
    private readonly participantsResolver: ConversationParticipantsResolver,
  ) {}

  async execute({ requestedIds, userId }: CreateDmInput): Promise<CreateDmOutput> {
    const { participantIds, participants } =
      await this.participantsResolver.resolve({
        requestedIds,
        currentUserId: userId,
        min: DM_MIN_OTHERS,
        max: DM_MAX_OTHERS,
      });
    const title = deriveConversationTitle({ participants, currentUserId: userId });
    const { conversation, alreadyExisted } = await this.conversations.createDm({
      participantIds,
      title,
    });
    return {
      conversation: toConversationResponse(conversation, participants),
      alreadyExisted,
    };
  }
}
