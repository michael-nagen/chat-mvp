import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConversationsService } from '../conversations/conversations.service';
import { AuthUser } from '../auth/current-user.decorator';
import {
  ConversationNotFoundException,
  ForbiddenException,
  ValidationException,
} from '../../common/errors/app.exception';


@Injectable()
export class AssistantConversationGuard implements CanActivate {
  constructor(private readonly conversations: ConversationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<
        Request<{ conversationId: string }> & { user: AuthUser }
      >();
    const conversationId = request.params.conversationId;
    const userId = request.user.userId;

    const conversation = await this.conversations.getById(conversationId);
    if (!conversation) {
      throw new ConversationNotFoundException();
    }
    if (!conversation.participantIds.includes(userId)) {
      throw new ForbiddenException(
        'You are not a participant in this conversation.',
      );
    }
    if (conversation.type !== 'assistant') {
      throw new ValidationException(
        'This conversation is not an assistant conversation.',
      );
    }
    return true;
  }
}
