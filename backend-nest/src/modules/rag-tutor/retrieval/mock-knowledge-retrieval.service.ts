import { Injectable } from '@nestjs/common';
import { KnowledgeRetrievalService } from './knowledge-retrieval.service';
import {
  RetrievedKnowledgeChunk,
  RetrieveKnowledgeChunksInput,
} from '../rag-tutor.types';

// Temporary retrieval used until the real Atlas Vector Search retrieval is wired
// in. Returns hardcoded chunks so the tutor answer flow can be built and tested
// end-to-end without Atlas. A question containing "no-context" or "weak"
// exercises the weak-retrieval path (empty / below-threshold results).
@Injectable()
export class MockKnowledgeRetrievalService extends KnowledgeRetrievalService {
  retrieve({
    question,
  }: RetrieveKnowledgeChunksInput): Promise<RetrievedKnowledgeChunk[]> {
    const normalized = question.toLowerCase();
    if (normalized.includes('no-context')) {
      return Promise.resolve([]);
    }
    if (normalized.includes('weak')) {
      // Below the 0.5 threshold → the tutor should treat this as no strong context.
      return Promise.resolve([
        {
          chunkId: 'mock-chunk-weak',
          documentId: 'mock-doc-1',
          documentName: 'mock-rag-intro.md',
          chunkIndex: 0,
          text: 'Loosely related background that should not ground an answer.',
          score: 0.31,
        },
      ]);
    }
    return Promise.resolve([
      {
        chunkId: 'mock-chunk-0',
        documentId: 'mock-doc-1',
        documentName: 'mock-rag-intro.md',
        chunkIndex: 0,
        text: 'RAG means Retrieval-Augmented Generation. It combines retrieval of relevant knowledge with generation by a language model.',
        score: 0.82,
      },
      {
        chunkId: 'mock-chunk-1',
        documentId: 'mock-doc-1',
        documentName: 'mock-rag-intro.md',
        chunkIndex: 1,
        text: 'Grounded answers should only use the retrieved context and should avoid making unsupported claims.',
        score: 0.76,
      },
    ]);
  }
}
