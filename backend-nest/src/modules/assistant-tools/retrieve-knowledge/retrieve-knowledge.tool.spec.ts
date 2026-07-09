import { RetrieveKnowledgeTool } from './retrieve-knowledge.tool';
import { KnowledgeRetrievalService } from '../../rag-tutor/retrieval/knowledge-retrieval.service';
import type {
  RetrievedKnowledgeChunk,
  RetrieveKnowledgeChunksInput,
} from '../../rag-tutor/rag-tutor.types';
import { ToolRegistry } from '../tool-registry/tool-registry';
import { ToolExecutor } from '../tool-executor/tool-executor';

// Records the retrieval input so the trusted-userId invariant is testable and
// returns a fixed chunk carrying every citation field.
class RecordingRetrievalService extends KnowledgeRetrievalService {
  readonly calls: RetrieveKnowledgeChunksInput[] = [];

  retrieve(
    input: RetrieveKnowledgeChunksInput,
  ): Promise<RetrievedKnowledgeChunk[]> {
    this.calls.push(input);
    return Promise.resolve([
      {
        chunkId: 'chunk-1',
        documentId: 'doc-1',
        documentName: 'guide.md',
        chunkIndex: 3,
        text: 'Relevant passage.',
        score: 0.87,
      },
    ]);
  }
}

describe('RetrieveKnowledgeTool', () => {
  it('retrieves with the trusted userId and returns citation metadata', async () => {
    const retrieval = new RecordingRetrievalService();
    const tool = new RetrieveKnowledgeTool(retrieval);

    const output = await tool.execute({
      input: { query: 'what is in my notes?' },
      context: { userId: 'u-1' },
    });

    expect(retrieval.calls).toHaveLength(1);
    expect(retrieval.calls[0].userId).toBe('u-1');
    expect(retrieval.calls[0].question).toBe('what is in my notes?');
    expect(output.chunks).toEqual([
      {
        chunkId: 'chunk-1',
        documentId: 'doc-1',
        documentName: 'guide.md',
        chunkIndex: 3,
        text: 'Relevant passage.',
        score: 0.87,
      },
    ]);
  });

  it('ignores a model-supplied userId and uses the trusted context userId', async () => {
    const retrieval = new RecordingRetrievalService();
    const tool = new RetrieveKnowledgeTool(retrieval);
    const executor = new ToolExecutor(new ToolRegistry([tool]));

    const result = await executor.execute({
      name: 'retrieve_knowledge',
      rawInput: { query: 'secrets', userId: 'attacker' },
      userId: 'u-1',
    });

    expect(result.ok).toBe(true);
    expect(retrieval.calls).toHaveLength(1);
    expect(retrieval.calls[0].userId).toBe('u-1');
  });
});
