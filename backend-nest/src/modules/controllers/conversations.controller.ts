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
import { CreateDmDto } from '../conversations/dto/create-dm.dto';
import { CreateGroupDto } from '../conversations/dto/create-group.dto';
import { CreateAssistantDto } from '../conversations/dto/create-assistant.dto';
import { ConversationResponse } from '../conversations/conversations.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { ListConversationsOrchestrator } from '../list-conversations-orchestrator/list-conversations.orchestrator';
import type { ListConversationsOutput } from '../list-conversations-orchestrator/list-conversations.module';
import { CreateDmOrchestrator } from '../create-dm-orchestrator/create-dm.orchestrator';
import { CreateGroupOrchestrator } from '../create-group-orchestrator/create-group.orchestrator';
import { CreateAssistantConversationOrchestrator } from '../create-assistant-conversation-orchestrator/create-assistant-conversation.orchestrator';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(
    private readonly listConversations: ListConversationsOrchestrator,
    private readonly createDm: CreateDmOrchestrator,
    private readonly createGroup: CreateGroupOrchestrator,
    private readonly createAssistant: CreateAssistantConversationOrchestrator,
  ) {}

  @Get()
  list(@CurrentUser() user: AuthUser): Promise<ListConversationsOutput> {
    return this.listConversations.execute({ userId: user.userId });
  }

  // Get-or-create: 201 when a new DM is created, 200 when an equivalent DM
  // already existed (idempotent by the normalized participant set).
  @Post('dm')
  async createDmConversation(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateDmDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ConversationResponse> {
    const { conversation, alreadyExisted } = await this.createDm.execute({
      requestedIds: dto.participantIds,
      userId: user.userId,
    });
    res.status(alreadyExisted ? HttpStatus.OK : HttpStatus.CREATED);
    return conversation;
  }

  @Post('groups')
  createGroupConversation(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateGroupDto,
  ): Promise<ConversationResponse> {
    return this.createGroup.execute({
      requestedIds: dto.participantIds,
      userId: user.userId,
      title: dto.title,
    });
  }

  // Single-user AI conversation; the assistant is implicit from the type.
  @Post('assistant')
  createAssistantConversation(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateAssistantDto,
  ): Promise<ConversationResponse> {
    return this.createAssistant.execute({
      userId: user.userId,
      title: dto.title,
    });
  }
}
