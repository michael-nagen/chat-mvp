import 'reflect-metadata';
import 'dotenv/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { KnowledgeRetrievalService } from '../../modules/rag-tutor/retrieval/knowledge-retrieval.service';
import { RagTutorService } from '../../modules/rag-tutor/rag-tutor.service';
import { UploadKnowledgeDocumentOrchestrator } from '../../modules/upload-knowledge-document-orchestrator/upload-knowledge-document.orchestrator';
import { UploadedFileLike } from '../../modules/knowledge-documents/knowledge-document.types';
import { RAG_EVAL_CASES } from './rag-eval-cases';
import { evaluateRetrieval, printRetrievalReport } from './retrieval-eval';
import { evaluateAnswer, printAnswerReport } from './answer-eval';

// Loose early-stage thresholds (see task spec).
const MIN_HIT_RATE = 0.7;
const MIN_AVG_KEYWORD_COVERAGE = 0.5;
const REQUIRED_FALLBACK_PASS_RATE = 1.0;

// Dedicated eval user so eval data is isolated from real users.
const EVAL_USER_ID = process.env.RAG_EVAL_USER_ID ?? 'rag-eval-user';

// Seeds the bundled test document (idempotent: upload dedups by userId+hash) so
// there is real, embedded content in Atlas to retrieve against.
async function seedTestDocument(
  upload: UploadKnowledgeDocumentOrchestrator,
): Promise<void> {
  const buffer = readFileSync(join(__dirname, 'rag-test.md'));
  const file: UploadedFileLike = {
    originalname: 'rag-test.md',
    buffer,
    size: buffer.length,
    mimetype: 'text/markdown',
  };
  const result = await upload.execute({ userId: EVAL_USER_ID, file });
  console.log(
    `Seed: rag-test.md ${result.alreadyExisted ? 'already present' : 'uploaded'} ` +
      `(${result.document.chunkCount} chunks).`,
  );
}

async function main(): Promise<void> {
  // Force real Atlas retrieval for the eval; embeddings + generator use their
  // defaults (OpenAI). Tests never run this file.
  process.env.RAG_RETRIEVAL_PROVIDER = 'atlas';

  if (!process.env.OPENAI_API_KEY) {
    console.log('OPENAI_API_KEY not set — skipping RAG eval (needs OpenAI + Atlas).');
    return;
  }
  if (!process.env.KNOWLEDGE_MONGO_URI && !process.env.MONGO_URI) {
    console.log('No Mongo URI set — skipping RAG eval (needs the Knowledge Atlas connection).');
    return;
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  try {
    await seedTestDocument(
      app.get(UploadKnowledgeDocumentOrchestrator, { strict: false }),
    );

    const retrieval = app.get(KnowledgeRetrievalService, { strict: false });
    const tutor = app.get(RagTutorService, { strict: false });

    const retrievalReport = await evaluateRetrieval({
      retrieval,
      userId: EVAL_USER_ID,
      cases: RAG_EVAL_CASES,
    });
    printRetrievalReport(retrievalReport);

    const answerReport = await evaluateAnswer({
      tutor,
      userId: EVAL_USER_ID,
      cases: RAG_EVAL_CASES,
    });
    printAnswerReport(answerReport);

    const failures: string[] = [];
    if (retrievalReport.hitRate < MIN_HIT_RATE) {
      failures.push(
        `hitRate ${retrievalReport.hitRate.toFixed(2)} < ${MIN_HIT_RATE}`,
      );
    }
    if (answerReport.averageKeywordCoverage < MIN_AVG_KEYWORD_COVERAGE) {
      failures.push(
        `averageKeywordCoverage ${answerReport.averageKeywordCoverage.toFixed(2)} < ${MIN_AVG_KEYWORD_COVERAGE}`,
      );
    }
    if (answerReport.fallbackPassRate < REQUIRED_FALLBACK_PASS_RATE) {
      failures.push(
        `fallbackPassRate ${answerReport.fallbackPassRate.toFixed(2)} < ${REQUIRED_FALLBACK_PASS_RATE}`,
      );
    }

    console.log(`\n${failures.length === 0 ? 'PASS' : 'FAIL'}`);
    if (failures.length > 0) {
      console.error(`Threshold failures: ${failures.join('; ')}`);
      process.exitCode = 1;
    }
  } finally {
    await app.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
