import type { Message } from '../../../shared/entities/Message.types';
import { requestSendMessage } from '../../../shared/api/apiClient';

export type SendMessageResponse = {
  message: Message;
};

export async function sendUserMessage(
  conversationId: string,
  content: string,
): Promise<SendMessageResponse> {
  return requestSendMessage(conversationId, content);
}
