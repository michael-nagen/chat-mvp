import { RagTutorService } from '../../modules/rag-tutor/rag-tutor.service';
import { RagEvalCase } from './rag-eval-cases';

const FALLBACK_MARKER = 'could not find relevant information';

export type AnswerCaseResult = {
  id: string;
  isFallbackCase: boolean;
  keywordCoverage: number;
  hasCitations: boolean;
  fallbackCorrect: boolean;
  pass: boolean;
};

export type AnswerReport = {
  results: AnswerCaseResult[];
  averageKeywordCoverage: number;
  citationCoverage: number;
  fallbackPassRate: number;
};

const includesCI = (haystack: string, needle: string): boolean =>
  haystack.toLowerCase().includes(needle.toLowerCase());

// Evaluates answer quality: keyword coverage + citation presence for positive
// cases, and fallback correctness for unknown cases (no source hints).
export async function evaluateAnswer({
  tutor,
  userId,
  cases,
}: {
  tutor: RagTutorService;
  userId: string;
  cases: RagEvalCase[];
}): Promise<AnswerReport> {
  const results: AnswerCaseResult[] = [];

  for (const testCase of cases) {
    const isFallbackCase = (testCase.expectedSourceHints ?? []).length === 0;
    const { answer, citations } = await tutor.answerQuestion({
      userId,
      question: testCase.question,
    });

    const keywordCoverage =
      testCase.expectedKeywords.filter((kw) => includesCI(answer, kw)).length /
      testCase.expectedKeywords.length;
    const hasCitations = citations.length > 0;
    // A fallback case is correct when the answer is the safe fallback and no
    // citations are attached.
    const fallbackCorrect =
      isFallbackCase && includesCI(answer, FALLBACK_MARKER) && !hasCitations;

    const pass = isFallbackCase
      ? fallbackCorrect
      : keywordCoverage >= 0.5 && hasCitations;

    results.push({
      id: testCase.id,
      isFallbackCase,
      keywordCoverage,
      hasCitations,
      fallbackCorrect,
      pass,
    });
  }

  const positives = results.filter((r) => !r.isFallbackCase);
  const fallbacks = results.filter((r) => r.isFallbackCase);
  const positiveCount = positives.length || 1;
  const fallbackCount = fallbacks.length || 1;

  return {
    results,
    averageKeywordCoverage:
      positives.reduce((s, r) => s + r.keywordCoverage, 0) / positiveCount,
    citationCoverage:
      positives.filter((r) => r.hasCitations).length / positiveCount,
    fallbackPassRate:
      fallbacks.filter((r) => r.fallbackCorrect).length / fallbackCount,
  };
}

export function printAnswerReport(report: AnswerReport): void {
  console.log('\nRAG Answer Eval\n');
  for (const r of report.results) {
    console.log(`Case: ${r.id}`);
    if (r.isFallbackCase) {
      console.log(`Fallback correctness: ${r.fallbackCorrect ? 'yes' : 'no'}`);
      console.log(`Citations: ${r.hasCitations ? 'yes' : 'none'}`);
    } else {
      console.log(`Keyword coverage: ${r.keywordCoverage.toFixed(2)}`);
      console.log(`Citations: ${r.hasCitations ? 'yes' : 'none'}`);
    }
    console.log(`Pass: ${r.pass ? 'yes' : 'no'}\n`);
  }
  console.log('Aggregate:');
  console.log(
    `Average keyword coverage: ${report.averageKeywordCoverage.toFixed(2)}`,
  );
  console.log(`Citation coverage: ${report.citationCoverage.toFixed(2)}`);
  console.log(`Fallback pass rate: ${report.fallbackPassRate.toFixed(2)}`);
}
