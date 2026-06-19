import { Module } from '@nestjs/common';
import { GetMeModule } from '../get-me/get-me.module';
import { UpdateProfileModule } from '../update-profile/update-profile.module';
import { UpdateEmailModule } from '../update-email/update-email.module';
import { RequestAvatarUploadModule } from '../request-avatar-upload/request-avatar-upload.module';
import { SetAvatarModule } from '../set-avatar/set-avatar.module';
import { RemoveAvatarModule } from '../remove-avatar/remove-avatar.module';
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
    UpdateProfileModule,
    UpdateEmailModule,
    RequestAvatarUploadModule,
    SetAvatarModule,
    RemoveAvatarModule,
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
