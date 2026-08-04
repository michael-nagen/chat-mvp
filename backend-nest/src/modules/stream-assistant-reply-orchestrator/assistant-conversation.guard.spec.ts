import { ExecutionContext } from '@nestjs/common';
import { AssistantConversationGuard } from './assistant-conversation.guard';
import { ConversationsService } from '../conversations/conversations.service';
import {
  ConversationNotFoundException,
  ForbiddenException,
  ValidationException,
} from '../../common/errors/app.exception';
import type { Conversation } from '../../common/storage/entities';

function contextFor({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}): ExecutionContext {
  const request = { params: { conversationId }, user: { userId } };
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

function guardWith(conversation: unknown): AssistantConversationGuard {
  const conversations = {
    getById: () => Promise.resolve(conversation),
  } as unknown as ConversationsService;
  return new AssistantConversationGuard(conversations);
}

const conversation = (over: Partial<Conversation>): Conversation =>
  ({
    id: 'c-1',
    type: 'assistant',
    participantIds: ['u1', 'general-assistant'],
    ...over,
  }) as unknown as Conversation;

describe('AssistantConversationGuard', () => {
  it('allows a participant on an assistant conversation', async () => {
    const guard = guardWith(conversation({ type: 'assistant' }));
    await expect(
      guard.canActivate(contextFor({ conversationId: 'c-1', userId: 'u1' })),
    ).resolves.toBe(true);
  });

  it('allows a participant on a tutor conversation', async () => {
    const guard = guardWith(
      conversation({ type: 'tutor', participantIds: ['u1', 'tutor-assistant'] }),
    );
    await expect(
      guard.canActivate(contextFor({ conversationId: 'c-1', userId: 'u1' })),
    ).resolves.toBe(true);
  });

  it('rejects a missing conversation with 404', async () => {
    const guard = guardWith(undefined);
    await expect(
      guard.canActivate(contextFor({ conversationId: 'c-x', userId: 'u1' })),
    ).rejects.toBeInstanceOf(ConversationNotFoundException);
  });

  it('rejects a non-participant with 403', async () => {
    const guard = guardWith(conversation({ participantIds: ['someone-else', 'general-assistant'] }));
    await expect(
      guard.canActivate(contextFor({ conversationId: 'c-1', userId: 'u1' })),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects a non-AI (dm/group) conversation so it never reaches AI streaming', async () => {
    const dm = guardWith(conversation({ type: 'dm', participantIds: ['u1', 'u2'] }));
    await expect(
      dm.canActivate(contextFor({ conversationId: 'c-1', userId: 'u1' })),
    ).rejects.toBeInstanceOf(ValidationException);

    const group = guardWith(
      conversation({ type: 'group', participantIds: ['u1', 'u2', 'u3'] }),
    );
    await expect(
      group.canActivate(contextFor({ conversationId: 'c-1', userId: 'u1' })),
    ).rejects.toBeInstanceOf(ValidationException);
  });
});
