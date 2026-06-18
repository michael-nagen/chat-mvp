import { Message } from '../../common/store/entities';

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

// Internal paginated result of raw entities; orchestrators map items to MessageResponse.
export interface MessagePage {
  items: Message[];
  nextCursor: string | null;
}

export interface MessagePageResponse {
  messages: MessageResponse[];
  nextCursor: string | null;
}
