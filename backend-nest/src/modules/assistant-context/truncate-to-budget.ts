import { ProviderMessage } from '../ai-provider/ai-provider.types';

export function truncateToBudget({
  messages,
  maxTokens,
  countTokens,
}: {
  messages: ProviderMessage[];
  maxTokens: number;
  countTokens: (text: string) => number;
}): ProviderMessage[] {
  const kept: ProviderMessage[] = [];
  let total = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const cost = countTokens(message.content);
    if (kept.length > 0 && total + cost > maxTokens) {
      break;
    }
    kept.unshift(message);
    total += cost;
  }
  return kept;
}
