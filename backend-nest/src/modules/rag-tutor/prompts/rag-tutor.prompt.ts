import { RetrievedKnowledgeChunk } from '../rag-tutor.types';

// Strict grounded tutor system prompt (prompts-as-code). The model must answer
// only from the provided context and cite the [Source N] labels it uses.
export const RAG_TUTOR_SYSTEM_PROMPT = [
  'You are a tutor answering based only on the provided knowledge context.',
  '',
  'Rules:',
  '1. Use only the context below.',
  '2. If the context does not contain the answer, say that relevant information was not found.',
  '3. Do not invent facts.',
  '4. Do not use outside knowledge.',
  '5. Be clear, helpful, and educational.',
  '6. When using information from the context, cite the relevant source labels (e.g. [Source 1]).',
].join('\n');

// Shown when retrieval returns no strong context, so the LLM is never called.
export const RAG_TUTOR_FALLBACK_ANSWER =
  'I could not find relevant information in your uploaded knowledge base for this question.';

// Renders retrieved chunks as labeled [Source N] blocks for the prompt. The label
// index (1-based) aligns with the citations returned to the caller.
export const formatKnowledgeContext = (
  chunks: RetrievedKnowledgeChunk[],
): string =>
  chunks
    .map((chunk, index) =>
      [
        `[Source ${index + 1}]`,
        `Document: ${chunk.documentName}`,
        `Chunk: ${chunk.chunkIndex}`,
        `Score: ${chunk.score.toFixed(2)}`,
        'Text:',
        chunk.text,
      ].join('\n'),
    )
    .join('\n\n');
