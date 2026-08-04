import { Module } from '@nestjs/common';
import { RagTutorModule } from '../../rag-tutor/rag-tutor.module';
import { RetrieveKnowledgeTool } from './retrieve-knowledge.tool';

// Owns the retrieve_knowledge tool. Reaches the knowledge domain through the
// Week 7 KnowledgeRetrievalService (exported by RagTutorModule), never the
// chunk storage layer directly.
@Module({
  imports: [RagTutorModule],
  providers: [RetrieveKnowledgeTool],
  exports: [RetrieveKnowledgeTool],
})
export class RetrieveKnowledgeModule {}
