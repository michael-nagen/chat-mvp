import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { TxContext, UnitOfWork } from '../../common/storage/unit-of-work';

// Runs the work inside a real MongoDB transaction. withTransaction auto-retries
// transient errors and rolls back on throw. The session is the opaque TxContext
// handed to repositories.
@Injectable()
export class MongoUnitOfWork extends UnitOfWork {
  constructor(@InjectConnection() private readonly connection: Connection) {
    super();
  }

  async run<T>(work: (tx: TxContext | undefined) => Promise<T>): Promise<T> {
    const session = await this.connection.startSession();
    try {
      let result: T | undefined;
      await session.withTransaction(async () => {
        result = await work(session);
      });
      return result as T;
    } finally {
      await session.endSession();
    }
  }
}
