import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { SearchMessagesQueryDto } from '../search-messages/dto/search-messages.query.dto';
import { SearchMessagesOrchestrator } from '../search-messages/search-messages.orchestrator';
import type { SearchMessagesOutput } from '../search-messages/search-messages.module';
import { GetRecentSearchesOrchestrator } from '../get-recent-searches/get-recent-searches.orchestrator';
import type { GetRecentSearchesOutput } from '../get-recent-searches/get-recent-searches.module';

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
    return this.searchMessagesOrchestrator.run({
      userId: user.userId,
      query: query.q ?? '',
      cursor: query.cursor,
      limit: query.limit,
    });
  }

  @Get('search/recent')
  getRecent(@CurrentUser() user: AuthUser): Promise<GetRecentSearchesOutput> {
    return this.getRecentSearchesOrchestrator.run({ userId: user.userId });
  }
}
