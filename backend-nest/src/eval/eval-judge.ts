import { LlmProvider } from '../modules/ai-provider/llm-provider';
import { EVAL_JUDGE_PROMPT } from './eval-judge.prompt';
import { judgmentSchema } from './eval.schema';
import type { EvalCase, Judgment } from './eval.types';

export async function judgeResponse({
  provider,
  evalCase,
  response,
}: {
  provider: LlmProvider;
  evalCase: EvalCase;
  response: string;
}): Promise<Judgment | null> {
  const raw = await provider.complete({
    system: EVAL_JUDGE_PROMPT,
    messages: [
      {
        role: 'user',
        content: JSON.stringify({
          response,
          expectedKeywords: evalCase.expectedKeywords,
          forbiddenKeywords: evalCase.forbiddenKeywords,
        }),
      },
    ],
  });
  const parsed = judgmentSchema.safeParse(extractJsonObject(raw));
  return parsed.success ? parsed.data : null;
}

function extractJsonObject(raw: string): unknown {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return undefined;
  }
}
