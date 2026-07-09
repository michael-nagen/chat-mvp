import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { MongoConnectionModule } from './modules/mongo/mongo-connection.module';
import { ControllersModule } from './modules/controllers/controllers.module';
import { USER_DRIVER } from './modules/user/user.module';
import { CONVERSATIONS_DRIVER } from './modules/conversations/conversations.module';
import { MESSAGES_DRIVER } from './modules/messages/messages.module';
import { KNOWLEDGE_DRIVER } from './modules/knowledge-documents/knowledge-documents.module';
import { KNOWLEDGE_CHUNKS_DRIVER } from './modules/knowledge-chunks/knowledge-chunks.module';
import { KnowledgeMongoConnectionModule } from './modules/knowledge-storage/knowledge-mongo-connection.module';
import { AgentModule } from './modules/agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Default app connection (MONGO_URI): users, conversations, messages, etc.
    // Opens only if some entity declares the mongo driver. Knowledge data lives
    // on its own connection (below), not here.
    MongoConnectionModule.forRoot([
      USER_DRIVER,
      CONVERSATIONS_DRIVER,
      MESSAGES_DRIVER,
    ]),
    // Dedicated Knowledge/RAG connection (KNOWLEDGE_MONGO_URI → Atlas).
    KnowledgeMongoConnectionModule.forRoot([
      KNOWLEDGE_DRIVER,
      KNOWLEDGE_CHUNKS_DRIVER,
    ]),
    CommonModule,
    ControllersModule,
    AgentModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
