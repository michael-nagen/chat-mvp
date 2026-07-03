import { Connection } from 'mongoose';
import { TxContext, UnitOfWork } from '../../common/storage/unit-of-work';

export class MongoUnitOfWork extends UnitOfWork {
  constructor(private readonly connection: Connection) {
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
