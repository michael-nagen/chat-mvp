import { Module } from '@nestjs/common';
import { GraphCheckpointer } from './checkpoint.provider';

// Provides the shared LangGraph checkpointer. Injects the default app Mongoose
// connection when present (global MongooseCoreModule) and degrades to an
// in-memory saver otherwise.
@Module({
  providers: [GraphCheckpointer],
  exports: [GraphCheckpointer],
})
export class CheckpointModule {}
