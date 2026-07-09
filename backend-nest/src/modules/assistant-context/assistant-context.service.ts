import { Injectable } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { ProviderMessage } from '../ai-provider/ai-provider.types';
import { TokenCounter } from './token-counter';
import { toProviderMessage } from './message-to-provider';
import { truncateToBudget } from './truncate-to-budget';
import {
  HISTORY_TOKEN_BUDGET,
  RECENT_MESSAGES_HARD_CAP,
} from './assistant-context.constants';

@Injectable()
export class AssistantContextService {
  constructor(
    private readonly messages: MessagesService,
    private readonly tokenCounter: TokenCounter,
  ) {}
 async prepare({
    conversationId,
    assistantParticipantId,
  }: {
    conversationId: string;
    assistantParticipantId: string;
  }): Promise<ProviderMessage[]> {
    const recent = await this.messages.listRecent({
      conversationId,
      limit: RECENT_MESSAGES_HARD_CAP,
    });
    return truncateToBudget({
      messages: recent.map((message) =>
        toProviderMessage(message, assistantParticipantId),
      ),
      maxTokens: HISTORY_TOKEN_BUDGET,
      countTokens: (text) => this.tokenCounter.count(text),
    });
  }
}
