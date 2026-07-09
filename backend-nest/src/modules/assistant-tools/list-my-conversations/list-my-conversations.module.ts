import { Module } from '@nestjs/common';
import { ListConversationsModule } from '../../list-conversations-orchestrator/list-conversations.module';
import { ListMyConversationsTool } from './list-my-conversations.tool';

// Owns the list_my_conversations tool. Reaches the conversations domain through
// its existing use-case orchestrator, never its repository.
@Module({
  imports: [ListConversationsModule],
  providers: [ListMyConversationsTool],
  exports: [ListMyConversationsTool],
})
export class ListMyConversationsModule {}
