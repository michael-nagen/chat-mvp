import { ZodType } from 'zod';
export interface ToolExecutionContext {
  userId: string;
}

export abstract class AssistantTool<TInput = unknown, TOutput = unknown> {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly inputSchema: ZodType<TInput>;
  abstract readonly outputSchema: ZodType<TOutput>;

  abstract execute(params: {
    input: TInput;
    context: ToolExecutionContext;
  }): Promise<TOutput>;
}
