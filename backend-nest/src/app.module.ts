import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { MongoConnectionModule } from './common/storage/mongo-connection.module';
import { ControllersModule } from './modules/controllers/controllers.module';
import { USER_DRIVER } from './modules/user/user.module';
import { CONVERSATIONS_DRIVER } from './modules/conversations/conversations.module';
import { MESSAGES_DRIVER } from './modules/messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Opens a Mongo connection only if some entity declares the mongo driver.
    // Each entity's driver lives in its own module, not here.
    MongoConnectionModule.forRoot([
      USER_DRIVER,
      CONVERSATIONS_DRIVER,
      MESSAGES_DRIVER,
    ]),
    CommonModule,
    ControllersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
