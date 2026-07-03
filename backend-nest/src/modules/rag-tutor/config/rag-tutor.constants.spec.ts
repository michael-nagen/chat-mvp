import {
  RAG_TUTOR_MIN_SCORE,
  resolveRagRetrievalProvider,
  resolveRagTutorMinScore,
  resolveRagTutorProvider,
} from './rag-tutor.constants';

describe('resolveRagRetrievalProvider', () => {
  it('selects atlas for atlas (tolerant of case/whitespace/quotes)', () => {
    for (const value of ['atlas', 'ATLAS', ' atlas ', '"atlas"', "'atlas'"]) {
      expect(resolveRagRetrievalProvider(value)).toBe('atlas');
    }
  });

  it('falls back to mock when unset or anything else', () => {
    for (const value of [undefined, '', 'mock', 'MOCK', 'nope']) {
      expect(resolveRagRetrievalProvider(value)).toBe('mock');
    }
  });
});

describe('resolveRagTutorProvider', () => {
  it('selects fake only for fake', () => {
    for (const value of ['fake', 'FAKE', ' fake ']) {
      expect(resolveRagTutorProvider(value)).toBe('fake');
    }
  });

  it('uses the real langchain generator otherwise (langchain/openai/unset)', () => {
    for (const value of [undefined, 'langchain', 'openai', 'anything']) {
      expect(resolveRagTutorProvider(value)).toBe('langchain');
    }
  });
});

describe('resolveRagTutorMinScore', () => {
  it('parses a valid 0..1 float', () => {
    expect(resolveRagTutorMinScore('0.8')).toBe(0.8);
    expect(resolveRagTutorMinScore(' "0.5" ')).toBe(0.5);
    expect(resolveRagTutorMinScore('0')).toBe(0);
    expect(resolveRagTutorMinScore('1')).toBe(1);
  });

  it('falls back to the safe default when unset or out of range/invalid', () => {
    for (const value of [undefined, '', 'abc', '-0.1', '1.5', '2']) {
      expect(resolveRagTutorMinScore(value)).toBe(RAG_TUTOR_MIN_SCORE);
    }
  });
});
