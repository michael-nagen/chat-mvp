import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { SearchService } from './search.service';
import { SearchMessagesQueryDto } from './dto/search-messages.query.dto';
import { MessageSearchResponse, RecentSearchesResponse } from './search.types';

@UseGuards(JwtAuthGuard)
@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('messages/search')
  searchMessages(
    @Query() query: SearchMessagesQueryDto,
    @CurrentUser() user: AuthUser,
  ): Promise<MessageSearchResponse> {
    return this.searchService.searchMessages({
      userId: user.userId,
      query: query.q ?? '',
      cursor: query.cursor,
      limit: query.limit,
    });
  }

  @Get('search/recent')
  getRecent(@CurrentUser() user: AuthUser): Promise<RecentSearchesResponse> {
    return this.searchService.getRecent({ userId: user.userId });
  }
}
