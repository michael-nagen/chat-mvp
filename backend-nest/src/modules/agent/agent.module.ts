import { Module } from '@nestjs/common';
import { AiProviderModule } from '../ai-provider/ai-provider.module';
import { AssistantModule } from '../assistant/assistant.module';
import { AssistantToolsModule } from '../assistant-tools/assistant-tools.module';
import { RagTutorModule } from '../rag-tutor/rag-tutor.module';
import { CheckpointModule } from './checkpoint/checkpoint.module';
import { AgentService } from './agent.service';

// Wires the agent execution modes onto the existing LLM provider, assistant
// registry, tool executor, and RAG services. No new connection is opened; the
// checkpointer reuses the default app connection and, in mongo mode, creates its
// (idempotent) checkpoint indexes on init.
@Module({
  imports: [
    AiProviderModule,
    AssistantModule,
    AssistantToolsModule,
    RagTutorModule,
    CheckpointModule,
  ],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
