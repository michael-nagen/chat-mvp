import { Module } from '@nestjs/common';
import { MessagesModule } from '../messages/messages.module';
import { AssistantContextService } from './assistant-context.service';
import { TokenCounter } from './token-counter';
import { GptTokenCounter } from './gpt-token-counter';

// Wires the context-prep service to the messages domain (via its service, never
// its repository) and binds the TokenCounter port to its concrete impl.
@Module({
  imports: [MessagesModule],
  providers: [
    AssistantContextService,
    { provide: TokenCounter, useClass: GptTokenCounter },
  ],
  exports: [AssistantContextService],
})
export class AssistantContextModule {}
