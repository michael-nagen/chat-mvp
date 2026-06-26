import 'reflect-metadata';
import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { OpenAiProvider } from '../modules/ai-provider/openai.provider';
import { LlmProvider } from '../modules/ai-provider/llm-provider';
import { ASSISTANT_SYSTEM_PROMPT } from '../prompts/assistant-system.prompt';
import { evalFileSchema } from './eval.schema';
import { judgeResponse } from './eval-judge';
import type { EvalCase } from './eval.types';

async function main(): Promise<void> {
  const parsed = evalFileSchema.safeParse(
    JSON.parse(readFileSync(join(__dirname, 'prompts.json'), 'utf8')),
  );
  if (!parsed.success) {
    console.error('Invalid eval file (prompts.json):');
    console.error(parsed.error.message);
    process.exit(1);
  }
  const cases = parsed.data.prompts;

  if (!process.env.OPENAI_API_KEY) {
    console.log(
      `Validated ${cases.length} eval cases. OPENAI_API_KEY not set — skipping live evals (no results faked).`,
    );
    return;
  }

  const provider = buildProvider();
  let passedCount = 0;

  for (const evalCase of cases) {
    const response = await runAssistant({ provider, evalCase });
    const judgment = await judgeResponse({ provider, evalCase, response });

    console.log(`\n=== ${evalCase.id} ===`);
    console.log(`prompt:   ${evalCase.prompt}`);
    console.log(`response: ${response}`);

    if (!judgment) {
      // Fail closed: the judge produced output that didn't satisfy the schema.
      console.log('judgment: FAIL (invalid judge output)');
      continue;
    }

    if (judgment.passed) {
      passedCount += 1;
    }
    console.log(`judgment: ${judgment.passed ? 'PASS' : 'FAIL'}`);
    console.log(`  matched:   [${judgment.matchedKeywords.join(', ')}]`);
    console.log(`  missing:   [${judgment.missingKeywords.join(', ')}]`);
    console.log(`  forbidden: [${judgment.forbiddenKeywordsFound.join(', ')}]`);
    console.log(`  reason:    ${judgment.reason}`);
  }

  console.log(`\nPassed ${passedCount}/${cases.length}`);
}

function buildProvider(): LlmProvider {
  const config = {
    getOrThrow: (key: string): string => {
      const value = process.env[key];
      if (!value) {
        throw new Error(`Missing env var: ${key}`);
      }
      return value;
    },
  } as unknown as ConfigService;
  return new OpenAiProvider(config);
}

function runAssistant({
  provider,
  evalCase,
}: {
  provider: LlmProvider;
  evalCase: EvalCase;
}): Promise<string> {
  return provider.complete({
    system: ASSISTANT_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: evalCase.prompt }],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
