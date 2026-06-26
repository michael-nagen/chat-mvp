import { z } from 'zod';
export const evalCaseSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  expectedKeywords: z.array(z.string()),
  forbiddenKeywords: z.array(z.string()),
});

export const evalFileSchema = z.object({
  prompts: z.array(evalCaseSchema),
});

export const judgmentSchema = z.object({
  passed: z.boolean(),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  forbiddenKeywordsFound: z.array(z.string()),
  reason: z.string(),
});
