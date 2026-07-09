import { Message } from '../../common/storage/entities';
import { ProviderMessage } from '../ai-provider/ai-provider.types';

export const toProviderMessage = (
  message: Message,
  assistantParticipantId: string,
): ProviderMessage => ({
  role: message.senderId === assistantParticipantId ? 'assistant' : 'user',
  content: message.content,
});
