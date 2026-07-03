import { Module } from '@nestjs/common';
import { KnowledgeChunksModule } from '../knowledge-chunks/knowledge-chunks.module';
import { KnowledgeChunkView } from '../knowledge-chunks/knowledge-chunk.types';
import { GetKnowledgeChunkOrchestrator } from './get-knowledge-chunk.orchestrator';

export interface GetKnowledgeChunkInput {
  userId: string;
  chunkId: string;
}

export type GetKnowledgeChunkOutput = KnowledgeChunkView;

@Module({
  imports: [KnowledgeChunksModule],
  providers: [GetKnowledgeChunkOrchestrator],
  exports: [GetKnowledgeChunkOrchestrator],
})
export class GetKnowledgeChunkModule {}
