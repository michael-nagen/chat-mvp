import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateConversationDto } from '../conversations/dto/create-conversation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { ListConversationsOrchestrator } from '../list-conversations-orchestrator/list-conversations.orchestrator';
import type { ListConversationsOutput } from '../list-conversations-orchestrator/list-conversations.module';
import { CreateConversationOrchestrator } from '../create-conversation/create-conversation.orchestrator';
import type { CreateConversationOutput } from '../create-conversation/create-conversation.module';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly listConversations: ListConversationsOrchestrator,
    private readonly createConversation: CreateConversationOrchestrator,
  ) {}

  @Get()
  list(@CurrentUser() user: AuthUser): Promise<ListConversationsOutput> {
    return this.listConversations.execute({ userId: user.userId });
  }

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateConversationDto,
  ): Promise<CreateConversationOutput> {
    return this.createConversation.run({
      email: dto.email,
      userId: user.userId,
    });
  }
}
