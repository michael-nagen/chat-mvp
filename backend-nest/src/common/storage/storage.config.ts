import { DynamicModule, Provider, Type } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import type { ModelDefinition } from '@nestjs/mongoose';
import { UnitOfWork } from './unit-of-work';
import { MongoUnitOfWork } from './unit-of-work.mongo';
import { InMemoryUnitOfWork } from './unit-of-work.memory';

// Each entity picks its own driver (see its module). STORAGE_DRIVER (env), when
// set, overrides every entity at once — used by tests to force in-memory.
export type StorageDriver = 'mongo' | 'memory';

type AbstractClass<T> = abstract new (...args: never[]) => T;

export function resolveStorageDriver(declared: StorageDriver): StorageDriver {
  const raw = process.env.STORAGE_DRIVER ?? declared;
  if (raw !== 'mongo' && raw !== 'memory') {
    throw new Error(
      `Invalid STORAGE_DRIVER "${raw}" (expected "mongo" or "memory").`,
    );
  }
  return raw;
}

// Binds an entity's abstract repository port to the concrete driver it declared.
export function repositoryProvider<T>(
  declared: StorageDriver,
  token: AbstractClass<T>,
  impls: { mongo: Type<T>; memory: Type<T> },
): Provider {
  return { provide: token, useClass: impls[resolveStorageDriver(declared)] };
}

// Registers an entity's Mongoose model only when that entity runs on mongo.
export function mongoFeatureImports(
  declared: StorageDriver,
  definitions: ModelDefinition[],
): DynamicModule[] {
  return resolveStorageDriver(declared) === 'mongo'
    ? [MongooseModule.forFeature(definitions)]
    : [];
}

// True when at least one entity runs on mongo, so a connection is needed.
export function needsMongoConnection(declared: StorageDriver[]): boolean {
  return declared.some((d) => resolveStorageDriver(d) === 'mongo');
}

// Binds UnitOfWork for a flow that spans the given entities. A real Mongo
// transaction is only possible when every participant runs on mongo; otherwise
// the boundary is an in-memory no-op.
export function unitOfWorkProvider(declared: StorageDriver[]): Provider {
  const transactional = declared.every(
    (d) => resolveStorageDriver(d) === 'mongo',
  );
  return {
    provide: UnitOfWork,
    useClass: transactional ? MongoUnitOfWork : InMemoryUnitOfWork,
  };
}

// Everything a module needs to wire one entity's storage, derived from the
// single `driver` const: the (conditional) Mongoose model import and the
// port→driver binding. Spread the result into the module's imports/providers.
export function repositoryStorage<T>(opts: {
  driver: StorageDriver;
  token: AbstractClass<T>;
  mongo: Type<T>;
  memory: Type<T>;
  feature: ModelDefinition;
}): { imports: DynamicModule[]; providers: Provider[] } {
  return {
    imports: mongoFeatureImports(opts.driver, [opts.feature]),
    providers: [
      repositoryProvider(opts.driver, opts.token, {
        mongo: opts.mongo,
        memory: opts.memory,
      }),
    ],
  };
}
