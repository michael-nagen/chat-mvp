import type { Connection } from 'mongoose';
import { MemorySaver } from '@langchain/langgraph';
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb';
import { GraphCheckpointer } from './checkpoint.provider';

// Minimal stand-in for the default Mongoose connection: MongoDBSaver only needs
// a client whose .db() resolves a database handle.
function fakeConnection(): Connection {
  const client = { db: () => ({}), appendMetadata: () => {} };
  return {
    getClient: () => client,
  } as unknown as Connection;
}

describe('GraphCheckpointer', () => {
  it('uses the MongoDB saver when the default connection is present', () => {
    const checkpointer = new GraphCheckpointer(fakeConnection());
    expect(checkpointer.saver).toBeInstanceOf(MongoDBSaver);
  });

  it('falls back to the in-memory saver when no connection exists', () => {
    const checkpointer = new GraphCheckpointer(undefined);
    expect(checkpointer.saver).toBeInstanceOf(MemorySaver);
  });
});
