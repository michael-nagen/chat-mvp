// Storage/provider-agnostic port for turning text into embedding vectors.
// Consumers depend on this abstract class, never on OpenAI/LangChain directly,
// so tests can swap in a deterministic fake. Mirrors LangChain's embeddings
// surface: many documents at once for ingestion, a single query for retrieval.
export abstract class EmbeddingsProvider {
  abstract embedDocuments(texts: string[]): Promise<number[][]>;
  abstract embedQuery(text: string): Promise<number[]>;
}
