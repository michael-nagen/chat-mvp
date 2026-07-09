import { Injectable, MessageEvent } from '@nestjs/common';
import { AssistantContextService } from '../assistant-context/assistant-context.service';
import { LlmProvider } from '../ai-provider/llm-provider';
import {
  ProviderInputItem,
  ProviderToolSpec,
} from '../ai-provider/ai-provider.types';
import { MessagesService } from '../messages/messages.service';
import { ConversationsService } from '../conversations/conversations.service';
import { UnitOfWork } from '../../common/storage/unit-of-work';
import { Message } from '../../common/storage/entities';
import { AssistantRegistry } from '../assistant/assistant.registry';
import { ToolRegistry } from '../assistant-tools/tool-registry/tool-registry';
import { ToolExecutor } from '../assistant-tools/tool-executor/tool-executor';
import { toProviderToolSpec } from './tool-spec.mapper';
import { parseToolArguments } from './parse-tool-arguments';
import type { StreamAssistantReplyInput } from './stream-assistant-reply.module';
import type {
  DoneEventData,
  ErrorEventData,
  TokenEventData,
} from './assistant-stream.types';

const GENERATION_FAILED_CODE = 'ASSISTANT_GENERATION_FAILED';
const TOOL_LIMIT_CODE = 'ASSISTANT_TOOL_LIMIT';

const MAX_TOOL_ITERATIONS = 5;

type ToolCall = { id: string; name: string; arguments: string };

@Injectable()
export class StreamAssistantReplyOrchestrator {
  constructor(
    private readonly assistantContext: AssistantContextService,
    private readonly provider: LlmProvider,
    private readonly messages: MessagesService,
    private readonly conversations: ConversationsService,
    private readonly assistants: AssistantRegistry,
    private readonly tools: ToolRegistry,
    private readonly toolExecutor: ToolExecutor,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async *execute({
    conversationId,
    userId,
  }: StreamAssistantReplyInput): AsyncGenerator<MessageEvent> {
    const assistant = await this.resolveAssistant({ conversationId });
    // Running turn input the loop extends with tool calls/results across passes.
    const items = await this.buildInitialItems({
      conversationId,
      assistantParticipantId: assistant.id,
    });
    const toolSpecs: ProviderToolSpec[] = this.tools
      .list()
      .map(toProviderToolSpec);

    let answer: string | undefined;
    try {
      for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
        const { text, toolCalls } = yield* this.streamOneTurn({
          system: assistant.systemPrompt,
          items,
          toolSpecs,
        });

        if (toolCalls.length === 0) {
          answer = text;
          break;
        }

        await this.executeToolCalls({ toolCalls, items, userId });
      }
    } catch {
      const data: ErrorEventData = {
        code: GENERATION_FAILED_CODE,
        message: 'Failed to generate a response.',
      };
      yield { type: 'error', data };
      return;
    }

    if (answer === undefined) {
      const data: ErrorEventData = {
        code: TOOL_LIMIT_CODE,
        message: 'The assistant could not complete the request.',
      };
      yield { type: 'error', data };
      return;
    }

    const reply = await this.persistReply({
      conversationId,
      content: answer,
      senderId: assistant.id,
    });
    const data: DoneEventData = { messageId: reply.id };
    yield { type: 'done', data };
  }

  private async resolveAssistant({
    conversationId,
  }: {
    conversationId: string;
  }) {
    const conversation = await this.conversations.getById(conversationId);
    const assistantParticipantId = conversation?.participantIds.find((id) =>
      this.assistants.isAssistant({ participantId: id }),
    );
    return this.assistants.resolve({ assistantId: assistantParticipantId });
  }

  private async buildInitialItems({
    conversationId,
    assistantParticipantId,
  }: {
    conversationId: string;
    assistantParticipantId: string;
  }): Promise<ProviderInputItem[]> {
    const history = await this.assistantContext.prepare({
      conversationId,
      assistantParticipantId,
    });
    return history.map((message) => ({
      kind: 'message',
      role: message.role,
      content: message.content,
    }));
  }

  private async *streamOneTurn({
    system,
    items,
    toolSpecs,
  }: {
    system: string;
    items: ProviderInputItem[];
    toolSpecs: ProviderToolSpec[];
  }): AsyncGenerator<MessageEvent, { text: string; toolCalls: ToolCall[] }> {
    let text = '';
    const toolCalls: ToolCall[] = [];

    for await (const event of this.provider.streamTurn({
      system,
      items,
      tools: toolSpecs,
    })) {
      if (event.type === 'text-delta') {
        text += event.delta;
        const data: TokenEventData = { delta: event.delta };
        yield { type: 'token', data };
      } else {
        toolCalls.push({
          id: event.id,
          name: event.name,
          arguments: event.arguments,
        });
      }
    }

    return { text, toolCalls };
  }

  private async executeToolCalls({
    toolCalls,
    items,
    userId,
  }: {
    toolCalls: ToolCall[];
    items: ProviderInputItem[];
    userId: string;
  }): Promise<void> {
    for (const call of toolCalls) {
      items.push({
        kind: 'tool_call',
        id: call.id,
        name: call.name,
        arguments: call.arguments,
      });
      const result = await this.toolExecutor.execute({
        name: call.name,
        rawInput: parseToolArguments(call.arguments),
        userId,
      });
      items.push({
        kind: 'tool_result',
        id: call.id,
        result: JSON.stringify(result),
      });
    }
  }

  private persistReply({
    conversationId,
    content,
    senderId,
  }: {
    conversationId: string;
    content: string;
    senderId: string;
  }): Promise<Message> {
    return this.unitOfWork.run(async (tx) => {
      const reply = await this.messages.create(
        { conversationId, userId: senderId, content },
        tx,
      );
      await this.conversations.updateLastMessage(
        { id: conversationId, lastMessage: content, updatedAt: reply.createdAt },
        tx,
      );
      return reply;
    });
  }
}
