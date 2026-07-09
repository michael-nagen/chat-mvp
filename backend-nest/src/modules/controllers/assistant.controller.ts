import {
  Controller,
  MessageEvent,
  Param,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { AssistantConversationGuard } from '../stream-assistant-reply-orchestrator/assistant-conversation.guard';
import { StreamAssistantReplyOrchestrator } from '../stream-assistant-reply-orchestrator/stream-assistant-reply.orchestrator';
@UseGuards(JwtAuthGuard, AssistantConversationGuard)
@Controller('conversations/:conversationId/assistant')
export class AssistantController {
  constructor(
    private readonly streamReply: StreamAssistantReplyOrchestrator,
  ) {}

  @Sse('stream')
  stream(
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: AuthUser,
  ): Observable<MessageEvent> {
    return from(
      this.streamReply.execute({ conversationId, userId: user.userId }),
    );
  }
}
