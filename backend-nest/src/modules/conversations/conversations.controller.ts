import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { Conversation } from '../../common/store/entities';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser): { conversations: Conversation[] } {
    return {
      conversations: this.conversationsService.getForUser(user.userId),
    };
  }

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateConversationDto,
  ): Conversation {
    return this.conversationsService.create({
      email: dto.email,
      userId: user.userId,
    });
  }
}
