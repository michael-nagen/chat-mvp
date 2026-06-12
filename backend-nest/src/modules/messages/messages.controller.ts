import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ListMessagesQueryDto } from './dto/list-messages.query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { MessagePageResponse, MessageResponse } from './messages.types';

@UseGuards(JwtAuthGuard)
@Controller('conversations/:conversationId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  list(
    @Param('conversationId') conversationId: string,
    @Query() query: ListMessagesQueryDto,
    @CurrentUser() user: AuthUser,
  ): MessagePageResponse {
    return this.messagesService.list({
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
  ): { message: MessageResponse } {
    return {
      message: this.messagesService.create({
        conversationId,
        userId: user.userId,
        content: dto.content,
      }),
    };
  }
}
