import { Conversation } from '../../common/storage/entities';
import { UserSummary } from '../user/user.types';
import { ConversationResponse } from './conversations.types';

// Raw participantIds stay internal; the orchestrator resolves them to public
// participant summaries and passes them in.
export const toConversationResponse = (
  conversation: Conversation,
  participants: UserSummary[],
): ConversationResponse => ({
  id: conversation.id,
  type: conversation.type,
  title: conversation.title,
  lastMessage: conversation.lastMessage,
  updatedAt: conversation.updatedAt,
  participants,
});
