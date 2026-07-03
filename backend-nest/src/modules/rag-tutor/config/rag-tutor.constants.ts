// Retrieval policy for the tutor (kept in sync with the knowledge-chunks
// retrieval defaults).
export const RAG_TUTOR_TOP_K = 5;

// Minimum cosine similarity for a chunk to be treated as grounding context.
// 0.65 (not 0.5): text-embedding-3-small has a high similarity floor, so even
// unrelated short English text scores ~0.5-0.58 against any doc. Measured on the
// bundled corpus, relevant top chunks score ~0.84+ while unrelated questions top
// out ~0.58 — 0.65 sits in that gap so unrelated questions fall back to "not
// found" instead of citing whatever chunk exists. Override with RAG_TUTOR_MIN_SCORE.
export const RAG_TUTOR_MIN_SCORE = 0.65;

// Optional override for the grounding threshold above (a 0..1 float).
export const RAG_TUTOR_MIN_SCORE_ENV = 'RAG_TUTOR_MIN_SCORE';

// DI token for the resolved (env-or-default) grounding threshold.
export const RAG_TUTOR_MIN_SCORE_TOKEN = 'RAG_TUTOR_MIN_SCORE_VALUE';

// Selects the answer generator: 'fake' (deterministic, no credentials — tests)
// or anything else, e.g. 'langchain'/'openai' (the real LangChain ChatOpenAI
// generator; the default).
export const RAG_TUTOR_PROVIDER_ENV = 'RAG_TUTOR_PROVIDER';

// Selects the retrieval implementation: 'atlas' (real Atlas Vector Search via
// knowledge-chunks — set this in a real dev .env) or 'mock' (default; offline
// canned chunks, keeps tests network-free).
export const RAG_RETRIEVAL_PROVIDER_ENV = 'RAG_RETRIEVAL_PROVIDER';

export type RagRetrievalProvider = 'atlas' | 'mock';
export type RagTutorProvider = 'langchain' | 'fake';

// Normalize raw env values (tolerant of casing/whitespace/quotes) so a stray
// space or capital letter never silently falls back to mock/fake.
const normalize = (raw: string | undefined): string =>
  (raw ?? '').trim().replace(/^["']|["']$/g, '').toLowerCase();

export const resolveRagRetrievalProvider = (
  raw: string | undefined,
): RagRetrievalProvider => (normalize(raw) === 'atlas' ? 'atlas' : 'mock');

export const resolveRagTutorProvider = (
  raw: string | undefined,
): RagTutorProvider => (normalize(raw) === 'fake' ? 'fake' : 'langchain');

// Parse the grounding threshold from env; fall back to the safe default when
// unset or not a valid 0..1 number, so a typo never silently disables grounding.
export const resolveRagTutorMinScore = (raw: string | undefined): number => {
  const normalized = normalize(raw);
  if (normalized === '') return RAG_TUTOR_MIN_SCORE; // unset, not a literal 0
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1
    ? parsed
    : RAG_TUTOR_MIN_SCORE;
};
