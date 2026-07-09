import { Injectable, OnModuleInit, Optional } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import type { MongoClient } from 'mongodb';
import type { BaseCheckpointSaver } from '@langchain/langgraph';
import { MemorySaver } from '@langchain/langgraph';
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb';

// Owns the single LangGraph checkpointer for the process. In mongo mode it wraps
// the existing default app connection's MongoClient (never a new connection, and
// never the Knowledge/Atlas one); in memory mode (STORAGE_DRIVER=memory / tests)
// there is no connection, so it falls back to the official in-memory saver so
// graphs still compile and resume within the process.
@Injectable()
export class GraphCheckpointer implements OnModuleInit {
  readonly saver: BaseCheckpointSaver;

  constructor(@Optional() @InjectConnection() connection?: Connection) {
    // mongoose and the checkpoint saver resolve slightly different mongodb
    // driver copies (6.20 vs 6.21), so getClient()'s type is nominally distinct
    // from the saver's MongoClient though it is the same runtime object. Bridge
    // that dual-package type gap once, here at the boundary.
    this.saver = connection
      ? new MongoDBSaver({
          client: connection.getClient() as unknown as MongoClient,
        })
      : new MemorySaver();
  }

  // Creating the checkpoint indexes requires a live connection, so only the
  // Mongo-backed saver needs setup; it is idempotent and safe on every start.
  async onModuleInit(): Promise<void> {
    if (this.saver instanceof MongoDBSaver) {
      await this.saver.setup();
    }
  }
}
