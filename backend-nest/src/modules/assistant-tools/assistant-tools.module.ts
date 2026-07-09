import { Module } from '@nestjs/common';
import { ToolRegistry } from './tool-registry/tool-registry';
import { ToolExecutor } from './tool-executor/tool-executor';
import { ListMyConversationsModule } from './list-my-conversations/list-my-conversations.module';
import { ListMyConversationsTool } from './list-my-conversations/list-my-conversations.tool';

@Module({
  imports: [ListMyConversationsModule],
  providers: [
    {
      provide: ToolRegistry,
      inject: [ListMyConversationsTool],
      useFactory: (listMyConversations: ListMyConversationsTool): ToolRegistry =>
        new ToolRegistry([listMyConversations]),
    },
    ToolExecutor,
  ],
  exports: [ToolExecutor, ToolRegistry],
})
export class AssistantToolsModule {}
