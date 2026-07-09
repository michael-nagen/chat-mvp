import { Conversation, ConversationType } from '../../common/storage/entities';
import { UserSummary } from '../user/user.types';
export interface CreateDmResult {
  conversation: Conversation;
  alreadyExisted: boolean;
}

export interface ConversationResponse {
  id: string;
  type: ConversationType;
  title: string;
  lastMessage: string;
  updatedAt: string;
  participants: UserSummary[];
}
