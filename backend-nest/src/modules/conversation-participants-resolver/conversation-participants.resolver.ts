import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { toUserSummary } from '../user/user.mapper';
import {
  ForbiddenException,
  NotFoundException,
  ValidationException,
} from '../../common/errors/app.exception';
import { UserSummary } from '../user/user.types';
import {
  ResolveParticipantsInput,
  ResolvedParticipants,
} from './conversation-participants.types';

// Shared by the DM and group create orchestrators so both normalize and validate
// a participant set the same way.
@Injectable()
export class ConversationParticipantsResolver {
  constructor(private readonly users: UserService) {}

  async resolve({
    requestedIds,
    currentUserId,
    min,
    max,
  }: ResolveParticipantsInput): Promise<ResolvedParticipants> {
    // Dedupe and drop the current user before counting, so the bound applies to
    // the distinct others regardless of what the client sent.
    const others = [...new Set(requestedIds)].filter(
      (id) => id !== currentUserId,
    );
    if (others.length < min || others.length > max) {
      throw new ValidationException(
        `A conversation needs between ${min} and ${max} other participants.`,
      );
    }

    const participantIds = [currentUserId, ...others];
    const sources = await this.users.findByIds(participantIds);
    if (sources.length !== participantIds.length) {
      throw new NotFoundException('One or more participants not found.');
    }

    // New conversations are limited to the creator's contacts. A self-only
    // conversation (no others) has nothing to check.
    if (others.length > 0) {
      const contactIds = new Set(await this.users.getContactIds(currentUserId));
      if (others.some((id) => !contactIds.has(id))) {
        throw new ForbiddenException(
          'One or more participants are not in your contacts.',
        );
      }
    }

    // Preserve participantIds order (current user first) for a stable response.
    const summaryById = new Map(
      sources.map((source) => [source.id, toUserSummary(source)]),
    );
    const participants = participantIds
      .map((id) => summaryById.get(id))
      .filter((summary): summary is UserSummary => summary !== undefined);

    return { participantIds, participants };
  }
}
