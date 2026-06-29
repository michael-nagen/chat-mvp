import { Injectable } from '@nestjs/common';
import { ConversationsService } from '../conversations/conversations.service';
import { ConversationParticipantsResolver } from '../conversation-participants-resolver/conversation-participants.resolver';
import { toConversationResponse } from '../conversations/conversations.mapper';
import { deriveConversationTitle } from '../conversations/conversation-title';
import type {
  CreateGroupInput,
  CreateGroupOutput,
} from './create-group.module';

const GROUP_MIN_OTHERS = 0;
const GROUP_MAX_OTHERS = 30;

@Injectable()
export class CreateGroupOrchestrator {
  constructor(
    private readonly conversations: ConversationsService,
    private readonly participantsResolver: ConversationParticipantsResolver,
  ) {}

  async execute({
    requestedIds,
    userId,
    title,
  }: CreateGroupInput): Promise<CreateGroupOutput> {
    const { participantIds, participants } =
      await this.participantsResolver.resolve({
        requestedIds,
        currentUserId: userId,
        min: GROUP_MIN_OTHERS,
        max: GROUP_MAX_OTHERS,
      });
    const finalTitle =
      title?.trim() ||
      deriveConversationTitle({ participants, currentUserId: userId }) ||
      'Notes';
    const conversation = await this.conversations.createGroup({
      participantIds,
      title: finalTitle,
    });
    return toConversationResponse(conversation, participants);
  }
}
