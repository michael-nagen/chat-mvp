import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageDriver, needsMongoConnection } from './storage.config';

// Opens the MongoDB connection only when at least one entity declares the mongo
// driver. It does not decide any entity's driver — it reacts to the per-entity
// choices passed in. With every entity on memory, no connection is opened.
@Module({})
export class MongoConnectionModule {
  static forRoot(declared: StorageDriver[]): DynamicModule {
    if (!needsMongoConnection(declared)) {
      return { module: MongoConnectionModule };
    }
    return {
      module: MongoConnectionModule,
      imports: [
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            uri: config.getOrThrow<string>('MONGO_URI'),
          }),
        }),
      ],
    };
  }
}
