import { Injectable } from '@nestjs/common';
import { ZodType } from 'zod';
import { AssistantTool, ToolExecutionContext } from '../tool-registry/assistant-tool';
import { KnowledgeRetrievalService } from '../../rag-tutor/retrieval/knowledge-retrieval.service';
import { RAG_TUTOR_TOP_K } from '../../rag-tutor/config/rag-tutor.constants';
import {
  retrieveKnowledgeInputSchema,
  retrieveKnowledgeOutputSchema,
} from './retrieve-knowledge.schema';
import {
  RetrieveKnowledgeInput,
  RetrieveKnowledgeOutput,
} from './retrieve-knowledge.types';

@Injectable()
export class RetrieveKnowledgeTool extends AssistantTool<
  RetrieveKnowledgeInput,
  RetrieveKnowledgeOutput
> {
  readonly name = 'retrieve_knowledge';
  readonly description =
    "Retrieves relevant passages from the current user's knowledge base to ground an answer. Use when the question is about the user's documents or uploaded knowledge. Returns scored chunks with citation metadata.";
  readonly inputSchema: ZodType<RetrieveKnowledgeInput> =
    retrieveKnowledgeInputSchema;
  readonly outputSchema: ZodType<RetrieveKnowledgeOutput> =
    retrieveKnowledgeOutputSchema;

  constructor(private readonly retrieval: KnowledgeRetrievalService) {
    super();
  }

  async execute({
    input,
    context,
  }: {
    input: RetrieveKnowledgeInput;
    context: ToolExecutionContext;
  }): Promise<RetrieveKnowledgeOutput> {
    const chunks = await this.retrieval.retrieve({
      userId: context.userId,
      question: input.query,
      topK: RAG_TUTOR_TOP_K,
    });
    return {
      chunks: chunks.map((chunk) => ({
        chunkId: chunk.chunkId,
        documentId: chunk.documentId,
        documentName: chunk.documentName,
        chunkIndex: chunk.chunkIndex,
        text: chunk.text,
        score: chunk.score,
      })),
    };
  }
}
