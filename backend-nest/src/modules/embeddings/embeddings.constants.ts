// OpenAI embedding model used for knowledge chunks + queries. 1536 dims must
// match the Atlas Vector Search index definition on the chunks collection.
export const EMBEDDING_MODEL = 'text-embedding-3-small';
export const EMBEDDING_DIMENSIONS = 1536;

// Selects the embeddings implementation: 'openai' (default) or 'fake'
// (deterministic, no network/credentials — used by the test suite).
export const EMBEDDINGS_PROVIDER_ENV = 'EMBEDDINGS_PROVIDER';

export type EmbeddingsProviderName = 'openai' | 'fake';

// Only an explicit 'fake' selects the test double; anything else (including
// unset) uses real OpenAI — kept symmetric with the RAG retrieval/tutor
// resolvers so a stray space or casing never silently picks the fake.
export const resolveEmbeddingsProvider = (
  raw: string | undefined,
): EmbeddingsProviderName =>
  (raw ?? '').trim().replace(/^["']|["']$/g, '').toLowerCase() === 'fake'
    ? 'fake'
    : 'openai';
