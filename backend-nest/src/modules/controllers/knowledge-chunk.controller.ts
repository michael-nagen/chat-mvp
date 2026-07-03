import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { GetKnowledgeChunkOrchestrator } from '../get-knowledge-chunk-orchestrator/get-knowledge-chunk.orchestrator';
import type { GetKnowledgeChunkOutput } from '../get-knowledge-chunk-orchestrator/get-knowledge-chunk.module';

// Citation-text hydration: fetch one of the caller's chunks by id. Used by the
// frontend to show a citation's source text on demand. Never returns embeddings.
@UseGuards(JwtAuthGuard)
@Controller('knowledge/chunks')
export class KnowledgeChunkController {
  constructor(private readonly getChunk: GetKnowledgeChunkOrchestrator) {}

  @Get(':chunkId')
  get(
    @CurrentUser() user: AuthUser,
    @Param('chunkId') chunkId: string,
  ): Promise<GetKnowledgeChunkOutput> {
    return this.getChunk.execute({ userId: user.userId, chunkId });
  }
}
