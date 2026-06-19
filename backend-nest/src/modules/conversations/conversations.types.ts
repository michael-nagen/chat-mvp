import { UserSummary } from '../user/user.types';

export interface ConversationResponse {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  // Public summaries of every participant; the frontend builds its message
  // sender map from these. Raw participantIds are never exposed.
  participants: UserSummary[];
}
