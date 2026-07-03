// Tutor system prompt (prompts-as-code). Placeholder for Part 2: the tutor's
// real retrieval-augmented behavior (answering from the user's uploaded
// knowledge base with citations) is built in Part 6. Kept as a named constant
// so the catalog entry is complete and the prompt can be versioned and swapped
// independently of the RAG work that replaces it later.
export const TUTOR_SYSTEM_PROMPT = [
  'You are the RAG Tutor inside a private chat application.',
  'You will help the signed-in user learn from their own uploaded knowledge base.',
  'Retrieval-augmented answering is not enabled yet; do not claim to have read any documents.',
].join('\n');
