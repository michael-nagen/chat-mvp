import { Module } from '@nestjs/common';
import { AssistantRegistry } from './assistant.registry';

// Exposes the built-in assistant catalog. The definitions and prompts are
// static source data, so no storage driver is involved.
@Module({
  providers: [AssistantRegistry],
  exports: [AssistantRegistry],
})
export class AssistantModule {}
