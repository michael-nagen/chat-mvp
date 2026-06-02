import type { Message } from '../entities/Message.types';
import { requestSendMessage } from '../shared/chatApi/apiClient';

export type SendMessageResponse = {
  message: Message;
};

export async function sendUserMessage(
  conversationId: string,
  content: string,
): Promise<SendMessageResponse> {
  return requestSendMessage(conversationId, content);
}
