import { Conversation } from '../../common/storage/entities';
import { UserSummary } from '../user/user.types';

// DM creation is get-or-create: `alreadyExisted` lets the caller surface 200 vs 201
// without a conflict error.
export interface CreateDmResult {
  conversation: Conversation;
  alreadyExisted: boolean;
}

export interface ConversationResponse {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  // Public summaries of every participant; the frontend builds its message
  // sender map from these. Raw participantIds are never exposed.
  participants: UserSummary[];
}
