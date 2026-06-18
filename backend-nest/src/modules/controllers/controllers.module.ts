import { Module } from '@nestjs/common';
import { GetMeModule } from '../get-me/get-me.module';
import { SignupModule } from '../signup/signup.module';
import { LoginModule } from '../login/login.module';
import { ListConversationsModule } from '../list-conversations/list-conversations.module';
import { CreateConversationModule } from '../create-conversation/create-conversation.module';
import { ListMessagesModule } from '../list-messages/list-messages.module';
import { SendMessageModule } from '../send-message/send-message.module';
import { SearchMessagesModule } from '../search-messages/search-messages.module';
import { GetRecentSearchesModule } from '../get-recent-searches/get-recent-searches.module';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import { ConversationsController } from './conversations.controller';
import { MessagesController } from './messages.controller';
import { SearchController } from './search.controller';

@Module({
  imports: [
    GetMeModule,
    SignupModule,
    LoginModule,
    ListConversationsModule,
    CreateConversationModule,
    ListMessagesModule,
    SendMessageModule,
    SearchMessagesModule,
    GetRecentSearchesModule,
  ],
  controllers: [
    AuthController,
    UserController,
    ConversationsController,
    MessagesController,
    SearchController,
  ],
})
export class ControllersModule {}
