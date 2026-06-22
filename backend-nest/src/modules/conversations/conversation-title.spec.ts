import { deriveConversationTitle } from './conversation-title';
import { UserSummary } from '../user/user.types';

const summary = (id: string, displayName: string): UserSummary => ({
  id,
  displayName,
  avatarUrl: null,
});

describe('deriveConversationTitle', () => {
  it("joins the other participants' names, excluding the current user", () => {
    const participants = [
      summary('u1', 'Alice Anderson'),
      summary('u2', 'Bob Brown'),
      summary('u3', 'Carol Carter'),
    ];
    expect(deriveConversationTitle({ participants, currentUserId: 'u1' })).toBe(
      'Bob Brown, Carol Carter',
    );
  });

  it('is just the other person for a two-person DM', () => {
    const participants = [
      summary('u1', 'Alice Anderson'),
      summary('u2', 'Bob Brown'),
    ];
    expect(deriveConversationTitle({ participants, currentUserId: 'u1' })).toBe(
      'Bob Brown',
    );
  });
});
