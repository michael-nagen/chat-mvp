import 'reflect-metadata';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { Message } from '../common/storage/entities';
import { MessagesService } from '../modules/messages/messages.service';
import { AssistantContextService } from '../modules/assistant-context/assistant-context.service';
import { GptTokenCounter } from '../modules/assistant-context/gpt-token-counter';
import { DEFAULT_ASSISTANT_ID } from '../modules/assistant/assistant.catalog';
import { OpenAiProvider } from '../modules/ai-provider/openai.provider';
import { ASSISTANT_SYSTEM_PROMPT } from '../prompts/assistant-system.prompt';

// Foundation verification for Part 1 (no HTTP route is wired yet). Proves:
//   1. Context preparation: recent messages → provider messages, role-mapped and
//      truncated to the token budget.
//   2. (Only when OPENAI_API_KEY is set) a real, non-streaming LLM call using the
//      system prompt + prepared context.
// Runs keyless: without a key it verifies context prep and skips the live call.
async function main(): Promise<void> {
  const sample: Message[] = [
    {
      id: 'm1',
      conversationId: 'c-demo',
      senderId: 'u1',
      content: 'Hi, what can you help me with?',
      createdAt: '2026-06-26T08:00:00.000Z',
    },
    {
      id: 'm2',
      conversationId: 'c-demo',
      senderId: DEFAULT_ASSISTANT_ID,
      content: 'I can answer questions and help with your conversations.',
      createdAt: '2026-06-26T08:00:05.000Z',
    },
    {
      id: 'm3',
      conversationId: 'c-demo',
      senderId: 'u1',
      content: 'Reply with a one-sentence summary of what you just said.',
      createdAt: '2026-06-26T08:00:10.000Z',
    },
  ];

  // Exercise the real context service with a stubbed messages source (no DB).
  const messages = {
    listRecent: (): Promise<Message[]> => Promise.resolve(sample),
  } as unknown as MessagesService;
  const context = new AssistantContextService(messages, new GptTokenCounter());
  const prepared = await context.prepare({
    conversationId: 'c-demo',
    assistantParticipantId: DEFAULT_ASSISTANT_ID,
  });

  console.log('Prepared provider messages (role-mapped, truncated to budget):');
  console.log(JSON.stringify(prepared, null, 2));

  if (!process.env.OPENAI_API_KEY) {
    console.log(
      '\nOPENAI_API_KEY not set — context preparation verified; skipping live LLM call.',
    );
    return;
  }

  const config = {
    getOrThrow: (key: string): string => {
      const value = process.env[key];
      if (!value) {
        throw new Error(`Missing env var: ${key}`);
      }
      return value;
    },
  } as unknown as ConfigService;
  const provider = new OpenAiProvider(config);
  const reply = await provider.complete({
    system: ASSISTANT_SYSTEM_PROMPT,
    messages: prepared,
  });
  console.log('\nAssistant reply:\n' + reply);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
