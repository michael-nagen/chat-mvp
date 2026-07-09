import { Injectable } from '@nestjs/common';
import { EmbeddingsProvider } from './embeddings-provider';
import { EMBEDDING_DIMENSIONS } from './embeddings.constants';

// Deterministic, dependency-free embeddings for tests: a hashed bag-of-words
// projected into EMBEDDING_DIMENSIONS and L2-normalized. Same text → same
// vector, and texts sharing words have higher cosine similarity, so retrieval
// tests are meaningful and reproducible without OpenAI.
@Injectable()
export class FakeEmbeddingsProvider extends EmbeddingsProvider {
  embedDocuments(texts: string[]): Promise<number[][]> {
    return Promise.resolve(texts.map((text) => embed(text)));
  }

  embedQuery(text: string): Promise<number[]> {
    return Promise.resolve(embed(text));
  }
}

function embed(text: string): number[] {
  const vector = new Array<number>(EMBEDDING_DIMENSIONS).fill(0);
  const tokens = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  for (const token of tokens) {
    vector[hashToken(token) % EMBEDDING_DIMENSIONS] += 1;
  }
  const norm = Math.sqrt(vector.reduce((sum, x) => sum + x * x, 0)) || 1;
  return vector.map((x) => x / norm);
}

// Small deterministic string hash (djb2). Non-negative so the modulo bucket is
// stable across runs.
function hashToken(token: string): number {
  let hash = 5381;
  for (let i = 0; i < token.length; i++) {
    hash = (hash * 33 + token.charCodeAt(i)) >>> 0;
  }
  return hash;
}
