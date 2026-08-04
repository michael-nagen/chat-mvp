import { Module } from '@nestjs/common';
import { ToolRegistry } from './tool-registry/tool-registry';
import { ToolExecutor } from './tool-executor/tool-executor';
import { ListMyConversationsModule } from './list-my-conversations/list-my-conversations.module';
import { ListMyConversationsTool } from './list-my-conversations/list-my-conversations.tool';
import { RetrieveKnowledgeModule } from './retrieve-knowledge/retrieve-knowledge.module';
import { RetrieveKnowledgeTool } from './retrieve-knowledge/retrieve-knowledge.tool';

@Module({
  imports: [ListMyConversationsModule, RetrieveKnowledgeModule],
  providers: [
    {
      provide: ToolRegistry,
      inject: [ListMyConversationsTool, RetrieveKnowledgeTool],
      useFactory: (
        listMyConversations: ListMyConversationsTool,
        retrieveKnowledge: RetrieveKnowledgeTool,
      ): ToolRegistry =>
        new ToolRegistry([listMyConversations, retrieveKnowledge]),
    },
    ToolExecutor,
  ],
  exports: [ToolExecutor, ToolRegistry],
})
export class AssistantToolsModule {}
