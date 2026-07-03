import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StorageDriver,
  needsMongoConnection,
} from '../../common/storage/storage.config';

export const KNOWLEDGE_CONNECTION = 'knowledge';

@Module({})
export class KnowledgeMongoConnectionModule {
  static forRoot(declared: StorageDriver[]): DynamicModule {
    if (!needsMongoConnection(declared)) {
      return { module: KnowledgeMongoConnectionModule };
    }
    return {
      module: KnowledgeMongoConnectionModule,
      imports: [
        MongooseModule.forRootAsync({
          connectionName: KNOWLEDGE_CONNECTION,
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            uri:
              config.get<string>('KNOWLEDGE_MONGO_URI') ??
              config.getOrThrow<string>('MONGO_URI'),
          }),
        }),
      ],
    };
  }
}
