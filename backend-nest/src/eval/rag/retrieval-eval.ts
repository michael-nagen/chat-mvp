import { KnowledgeRetrievalService } from '../../modules/rag-tutor/retrieval/knowledge-retrieval.service';
import { RetrievedKnowledgeChunk } from '../../modules/rag-tutor/rag-tutor.types';
import { RagEvalCase } from './rag-eval-cases';

const TOP_K = 5;
const MIN_SCORE = 0.5;

export type RetrievalCaseResult = {
  id: string;
  question: string;
  topChunks: number;
  hit: boolean;
  precisionAtK: number;
  recallAtK: number;
};

export type RetrievalReport = {
  results: RetrievalCaseResult[];
  hitRate: number;
  averagePrecision: number;
  averageRecall: number;
};

const includesCI = (haystack: string, needle: string): boolean =>
  haystack.toLowerCase().includes(needle.toLowerCase());

// A chunk is "relevant" if it comes from an expected source OR its text contains
// an expected keyword.
const isRelevant = (
  chunk: RetrievedKnowledgeChunk,
  testCase: RagEvalCase,
): boolean =>
  (testCase.expectedSourceHints ?? []).some((hint) =>
    includesCI(chunk.documentName, hint),
  ) || testCase.expectedKeywords.some((kw) => includesCI(chunk.text, kw));

// Evaluates retrieval quality over the positive cases (those with source hints).
// Simple metrics: precision@K over returned chunks, recall@K as the fraction of
// expected keywords surfaced anywhere in the returned chunks, and hit rate.
export async function evaluateRetrieval({
  retrieval,
  userId,
  cases,
}: {
  retrieval: KnowledgeRetrievalService;
  userId: string;
  cases: RagEvalCase[];
}): Promise<RetrievalReport> {
  const positives = cases.filter(
    (c) => (c.expectedSourceHints ?? []).length > 0,
  );
  const results: RetrievalCaseResult[] = [];

  for (const testCase of positives) {
    const chunks = await retrieval.retrieve({
      userId,
      question: testCase.question,
      topK: TOP_K,
      minScore: MIN_SCORE,
    });
    const relevant = chunks.filter((chunk) => isRelevant(chunk, testCase));
    const keywordsFound = testCase.expectedKeywords.filter((kw) =>
      chunks.some((chunk) => includesCI(chunk.text, kw)),
    ).length;

    results.push({
      id: testCase.id,
      question: testCase.question,
      topChunks: chunks.length,
      hit: relevant.length > 0,
      precisionAtK: chunks.length === 0 ? 0 : relevant.length / chunks.length,
      recallAtK:
        testCase.expectedKeywords.length === 0
          ? 0
          : keywordsFound / testCase.expectedKeywords.length,
    });
  }

  const count = results.length || 1;
  return {
    results,
    hitRate: results.filter((r) => r.hit).length / count,
    averagePrecision: results.reduce((s, r) => s + r.precisionAtK, 0) / count,
    averageRecall: results.reduce((s, r) => s + r.recallAtK, 0) / count,
  };
}

export function printRetrievalReport(report: RetrievalReport): void {
  console.log('\nRAG Retrieval Eval\n');
  for (const r of report.results) {
    console.log(`Case: ${r.id}`);
    console.log(`Question: ${r.question}`);
    console.log(`Top chunks: ${r.topChunks}`);
    console.log(`Hit: ${r.hit ? 'yes' : 'no'}`);
    console.log(`Precision@5: ${r.precisionAtK.toFixed(2)}`);
    console.log(`Recall@5: ${r.recallAtK.toFixed(2)}\n`);
  }
  console.log('Aggregate:');
  console.log(`Hit rate: ${report.hitRate.toFixed(2)}`);
  console.log(`Average precision@5: ${report.averagePrecision.toFixed(2)}`);
  console.log(`Average recall@5: ${report.averageRecall.toFixed(2)}`);
}
