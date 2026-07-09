import { Module } from '@nestjs/common';
import { KnowledgeChunksModule } from '../knowledge-chunks/knowledge-chunks.module';
import { KnowledgeChunkMatch } from '../knowledge-chunks/knowledge-chunk.types';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { RetrieveKnowledgeOrchestrator } from './retrieve-knowledge.orchestrator';

export interface RetrieveKnowledgeInput {
  userId: string;
  query: string;
}

export interface RetrieveKnowledgeOutput {
  results: KnowledgeChunkMatch[];
}

@Module({
  imports: [KnowledgeChunksModule, EmbeddingsModule],
  providers: [RetrieveKnowledgeOrchestrator],
  exports: [RetrieveKnowledgeOrchestrator],
})
export class RetrieveKnowledgeModule {}
