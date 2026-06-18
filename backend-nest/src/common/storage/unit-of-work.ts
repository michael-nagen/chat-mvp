// Transaction-boundary abstraction. Orchestrators call run() to execute work
// atomically and pass the opaque tx handle down to repositories — without ever
// importing Mongoose. Only the mongo driver knows the handle is a ClientSession;
// the in-memory driver ignores it.
export type TxContext = object;

export abstract class UnitOfWork {
  abstract run<T>(work: (tx: TxContext | undefined) => Promise<T>): Promise<T>;
}
