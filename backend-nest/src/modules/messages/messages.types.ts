import { Message, MessageMetadata } from '../../common/storage/entities';

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  // Present only for messages that carry it (tutor citations); absent otherwise
  // so existing message responses are unchanged.
  metadata?: MessageMetadata;
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
