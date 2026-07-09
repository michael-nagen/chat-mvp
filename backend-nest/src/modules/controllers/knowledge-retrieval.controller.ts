import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { RetrieveKnowledgeOrchestrator } from '../retrieve-knowledge-orchestrator/retrieve-knowledge.orchestrator';
import type { RetrieveKnowledgeOutput } from '../retrieve-knowledge-orchestrator/retrieve-knowledge.module';
import { RetrieveKnowledgeDto } from '../retrieve-knowledge-orchestrator/retrieve-knowledge.dto';

// Authenticated vector-search retrieval over the caller's own knowledge chunks.
// Exists so retrieval can be exercised independently before the Part 6 RAG chain.
@UseGuards(JwtAuthGuard)
@Controller('knowledge/retrieval')
export class KnowledgeRetrievalController {
  constructor(private readonly retrieve: RetrieveKnowledgeOrchestrator) {}

  @Post()
  search(
    @CurrentUser() user: AuthUser,
    @Body() dto: RetrieveKnowledgeDto,
  ): Promise<RetrieveKnowledgeOutput> {
    return this.retrieve.execute({ userId: user.userId, query: dto.query });
  }
}
