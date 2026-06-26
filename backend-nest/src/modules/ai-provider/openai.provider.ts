import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type {
  ResponseInput,
  ResponseInputItem,
  Tool,
} from 'openai/resources/responses/responses';
import { LlmProvider } from './llm-provider';
import {
  CompleteParams,
  ProviderTurnEvent,
  StreamTurnParams,
} from './ai-provider.types';
import { OPENAI_API_KEY_ENV, OPENAI_MODEL } from './ai-provider.constants';

@Injectable()
export class OpenAiProvider extends LlmProvider {
  private client: OpenAI | undefined;

  constructor(private readonly config: ConfigService) {
    super();
  }

  async complete({ system, messages }: CompleteParams): Promise<string> {
    const input: ResponseInput = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    const response = await this.getClient().responses.create({
      model: OPENAI_MODEL,
      instructions: system,
      input,
    });
    return response.output_text;
  }

  async *streamTurn({
    system,
    items,
    tools,
  }: StreamTurnParams): AsyncIterable<ProviderTurnEvent> {
    const input: ResponseInput = items.map((item): ResponseInputItem => {
      if (item.kind === 'message') {
        return { role: item.role, content: item.content };
      }
      if (item.kind === 'tool_call') {
        return {
          type: 'function_call',
          call_id: item.id,
          name: item.name,
          arguments: item.arguments,
        };
      }
      return {
        type: 'function_call_output',
        call_id: item.id,
        output: item.result,
      };
    });

    const functionTools: Tool[] = tools.map((tool) => ({
      type: 'function',
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
      strict: false,
    }));

    const events = await this.getClient().responses.create({
      model: OPENAI_MODEL,
      instructions: system,
      input,
      tools: functionTools,
      stream: true,
    });

    for await (const event of events) {
      if (event.type === 'response.output_text.delta') {
        yield { type: 'text-delta', delta: event.delta };
      } else if (
        event.type === 'response.output_item.done' &&
        event.item.type === 'function_call'
      ) {
        yield {
          type: 'tool-call',
          id: event.item.call_id,
          name: event.item.name,
          arguments: event.item.arguments,
        };
      }
    }
  }

  private getClient(): OpenAI {
    if (!this.client) {
 
      this.client = new OpenAI({
        apiKey: this.config.getOrThrow<string>(OPENAI_API_KEY_ENV),
      });
    }
    return this.client;
  }
}
