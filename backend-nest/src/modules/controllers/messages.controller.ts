import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CreateMessageDto } from '../messages/dto/create-message.dto';
import { ListMessagesQueryDto } from '../messages/dto/list-messages.query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { ListMessagesOrchestrator } from '../list-messages-orchestrator/list-messages.orchestrator';
import type { ListMessagesOutput } from '../list-messages-orchestrator/list-messages.module';
import { SendMessageOrchestrator } from '../send-message-orchestrator/send-message.orchestrator';
import type { SendMessageOutput } from '../send-message-orchestrator/send-message.module';

@UseGuards(JwtAuthGuard)
@Controller('conversations/:conversationId/messages')
export class MessagesController {
  constructor(
    private readonly listMessages: ListMessagesOrchestrator,
    private readonly sendMessage: SendMessageOrchestrator,
  ) {}

  @Get()
  list(
    @Param('conversationId') conversationId: string,
    @Query() query: ListMessagesQueryDto,
    @CurrentUser() user: AuthUser,
  ): Promise<ListMessagesOutput> {
    return this.listMessages.execute({
      conversationId,
      userId: user.userId,
      cursor: query.cursor,
      limit: query.limit,
    });
  }

  @Post()
  create(
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateMessageDto,
    @CurrentUser() user: AuthUser,
  ): Promise<SendMessageOutput> {
    return this.sendMessage.execute({
      conversationId,
      userId: user.userId,
      content: dto.content,
    });
  }
}
