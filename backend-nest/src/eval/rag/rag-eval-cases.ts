export type RagEvalCase = {
  id: string;
  question: string;
  expectedKeywords: string[];
  // Substrings expected to appear in a retrieved chunk's documentName (source).
  // Absent for "unknown" cases where retrieval should find nothing relevant.
  expectedSourceHints?: string[];
};

// Small dataset grounded in the bundled rag-test.md document (self-seeded by the
// eval runner). Two positive cases + one unknown/fallback case.
export const RAG_EVAL_CASES: RagEvalCase[] = [
  {
    id: 'rag-definition',
    question: 'What is RAG?',
    expectedKeywords: [
      'Retrieval-Augmented Generation',
      'retrieval',
      'generation',
    ],
    expectedSourceHints: ['rag-test'],
  },
  {
    id: 'grounding',
    question: 'Why should answers be grounded in retrieved context?',
    expectedKeywords: ['context', 'unsupported claims', 'hallucinations'],
    expectedSourceHints: ['rag-test'],
  },
  {
    id: 'unknown-question',
    question: 'What is the refund policy?',
    expectedKeywords: ['could not find relevant information'],
  },
];
