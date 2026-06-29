import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { SearchMessagesQueryDto } from '../search-messages-orchestrator/dto/search-messages.query.dto';
import { SearchMessagesOrchestrator } from '../search-messages-orchestrator/search-messages.orchestrator';
import type { SearchMessagesOutput } from '../search-messages-orchestrator/search-messages.module';
import { GetRecentSearchesOrchestrator } from '../get-recent-searches-orchestrator/get-recent-searches.orchestrator';
import type { GetRecentSearchesOutput } from '../get-recent-searches-orchestrator/get-recent-searches.module';

@UseGuards(JwtAuthGuard)
@Controller()
export class SearchController {
  constructor(
    private readonly searchMessagesOrchestrator: SearchMessagesOrchestrator,
    private readonly getRecentSearchesOrchestrator: GetRecentSearchesOrchestrator,
  ) {}

  @Get('messages/search')
  searchMessages(
    @Query() query: SearchMessagesQueryDto,
    @CurrentUser() user: AuthUser,
  ): Promise<SearchMessagesOutput> {
    return this.searchMessagesOrchestrator.execute({
      userId: user.userId,
      query: query.q ?? '',
      cursor: query.cursor,
      limit: query.limit,
    });
  }

  @Get('search/recent')
  getRecent(@CurrentUser() user: AuthUser): Promise<GetRecentSearchesOutput> {
    return this.getRecentSearchesOrchestrator.execute({ userId: user.userId });
  }
}
