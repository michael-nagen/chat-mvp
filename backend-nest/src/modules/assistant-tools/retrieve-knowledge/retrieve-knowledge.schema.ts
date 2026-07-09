import { z } from 'zod';

// No userId field: the model supplies only the query. The trusted userId is
// injected by ToolExecutor from backend context, so it can never be spoofed
// through tool arguments.
export const retrieveKnowledgeInputSchema = z.object({
  query: z.string().min(1),
});

export const retrieveKnowledgeOutputSchema = z.object({
  chunks: z.array(
    z.object({
      chunkId: z.string(),
      documentId: z.string(),
      documentName: z.string(),
      chunkIndex: z.number(),
      text: z.string(),
      score: z.number(),
    }),
  ),
});
