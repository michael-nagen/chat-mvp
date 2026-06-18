import { Injectable } from '@nestjs/common';
import { TxContext, UnitOfWork } from './unit-of-work';

// No real transactions in memory: just run the work with no tx handle.
@Injectable()
export class InMemoryUnitOfWork extends UnitOfWork {
  run<T>(work: (tx: TxContext | undefined) => Promise<T>): Promise<T> {
    return work(undefined);
  }
}
