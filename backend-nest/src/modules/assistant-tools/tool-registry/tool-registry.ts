import { Injectable } from '@nestjs/common';
import { AssistantTool } from './assistant-tool';

@Injectable()
export class ToolRegistry {
  private readonly byName: Map<string, AssistantTool>;

  constructor(tools: AssistantTool[]) {
    this.byName = new Map(tools.map((tool) => [tool.name, tool]));
  }

  get({ name }: { name: string }): AssistantTool | undefined {
    return this.byName.get(name);
  }

  list(): AssistantTool[] {
    return [...this.byName.values()];
  }
}
