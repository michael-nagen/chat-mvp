import { ConversationParticipantsResolver } from './conversation-participants.resolver';
import { UserService } from '../user/user.service';
import {
  ForbiddenException,
  NotFoundException,
  ValidationException,
} from '../../common/errors/app.exception';

// Minimal UserService stub: knows a fixed set of users and mimics findByIds'
// contract (missing ids omitted, order not relied upon). Every known user is a
// contact unless an explicit contactIds list is given.
const stubUsers = (
  known: Record<string, string>,
  contactIds: string[] = Object.keys(known),
): UserService =>
  ({
    findByIds: (ids: string[]) =>
      Promise.resolve(
        ids
          .filter((id) => known[id])
          .map((id) => ({
            id,
            firstName: known[id],
            lastName: 'Test',
            avatarUrl: null,
          })),
      ),
    getContactIds: () => Promise.resolve(contactIds),
  }) as unknown as UserService;

describe('ConversationParticipantsResolver', () => {
  it('dedupes requested ids, strips the current user, and adds them first', async () => {
    const resolver = new ConversationParticipantsResolver(
      stubUsers({ u1: 'Alice', u2: 'Bob' }),
    );

    const { participantIds, participants } = await resolver.resolve({
      requestedIds: ['u2', 'u2', 'u1'],
      currentUserId: 'u1',
      min: 1,
      max: 15,
    });

    expect(participantIds).toEqual(['u1', 'u2']);
    expect(participants.map((p) => p.id)).toEqual(['u1', 'u2']);
  });

  it('rejects a set that resolves to only the current user', async () => {
    const resolver = new ConversationParticipantsResolver(
      stubUsers({ u1: 'Alice' }),
    );

    await expect(
      resolver.resolve({
        requestedIds: ['u1'],
        currentUserId: 'u1',
        min: 1,
        max: 15,
      }),
    ).rejects.toBeInstanceOf(ValidationException);
  });

  it('rejects when a requested participant does not exist', async () => {
    const resolver = new ConversationParticipantsResolver(
      stubUsers({ u1: 'Alice' }),
    );

    await expect(
      resolver.resolve({
        requestedIds: ['ghost'],
        currentUserId: 'u1',
        min: 1,
        max: 15,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects more others than max before any lookup', async () => {
    const resolver = new ConversationParticipantsResolver(
      stubUsers({ u1: 'Alice' }),
    );

    await expect(
      resolver.resolve({
        requestedIds: ['a', 'b', 'c'],
        currentUserId: 'u1',
        min: 1,
        max: 2,
      }),
    ).rejects.toBeInstanceOf(ValidationException);
  });

  it('rejects an existing user who is not one of the current user\'s contacts', async () => {
    // Bob exists but is not in Alice's contacts.
    const resolver = new ConversationParticipantsResolver(
      stubUsers({ u1: 'Alice', u2: 'Bob' }, []),
    );

    await expect(
      resolver.resolve({
        requestedIds: ['u2'],
        currentUserId: 'u1',
        min: 1,
        max: 15,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
