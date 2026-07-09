import { Injectable } from '@nestjs/common';
import { ZodType } from 'zod';
import { AssistantTool, ToolExecutionContext } from '../tool-registry/assistant-tool';
import { ListConversationsOrchestrator } from '../../list-conversations-orchestrator/list-conversations.orchestrator';
import {
  listMyConversationsInputSchema,
  listMyConversationsOutputSchema,
} from './list-my-conversations.schema';
import {
  ListMyConversationsInput,
  ListMyConversationsOutput,
} from './list-my-conversations.types';


@Injectable()
export class ListMyConversationsTool extends AssistantTool<
  ListMyConversationsInput,
  ListMyConversationsOutput
> {
  readonly name = 'list_my_conversations';
  readonly description =
    "Lists the current user's conversations (id, title, last message, updated time). Use when the user asks about their conversations or chat history.";
  readonly inputSchema: ZodType<ListMyConversationsInput> =
    listMyConversationsInputSchema;
  readonly outputSchema: ZodType<ListMyConversationsOutput> =
    listMyConversationsOutputSchema;

  constructor(private readonly listConversations: ListConversationsOrchestrator) {
    super();
  }

  async execute({
    context,
  }: {
    input: ListMyConversationsInput;
    context: ToolExecutionContext;
  }): Promise<ListMyConversationsOutput> {
    const { conversations } = await this.listConversations.execute({
      userId: context.userId,
    });
    return {
      conversations: conversations.map((conversation) => ({
        id: conversation.id,
        title: conversation.title,
        lastMessage: conversation.lastMessage,
        updatedAt: conversation.updatedAt,
      })),
    };
  }
}
