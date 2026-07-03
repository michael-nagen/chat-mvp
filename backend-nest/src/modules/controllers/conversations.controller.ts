import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateConversationDto } from '../conversations/dto/create-conversation.dto';
import { ConversationResponse } from '../conversations/conversations.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { ListConversationsOrchestrator } from '../list-conversations-orchestrator/list-conversations.orchestrator';
import type { ListConversationsOutput } from '../list-conversations-orchestrator/list-conversations.module';
import { CreateConversationOrchestrator } from '../create-conversation-orchestrator/create-conversation.orchestrator';

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

  // Unified create endpoint, discriminated by `type`. Get-or-create semantics:
  // 201 when a new conversation is created, 200 when an equivalent DM already
  // existed (idempotent by the normalized participant set).
  @Post()
  async create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateConversationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ConversationResponse> {
    const { conversation, alreadyExisted } = await this.createConversation.execute({
      userId: user.userId,
      type: dto.type,
      contactIds: dto.contactIds,
      title: dto.title,
    });
    res.status(alreadyExisted ? HttpStatus.OK : HttpStatus.CREATED);
    return conversation;
  }
}
