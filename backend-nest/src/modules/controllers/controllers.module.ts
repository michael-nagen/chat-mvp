import { Module } from '@nestjs/common';
import { GetMeModule } from '../get-me-orchestrator/get-me.module';
import { GetContactsModule } from '../get-contacts-orchestrator/get-contacts.module';
import { UpdateProfileModule } from '../update-profile-orchestrator/update-profile.module';
import { UpdateEmailModule } from '../update-email-orchestrator/update-email.module';
import { RequestAvatarUploadModule } from '../request-avatar-upload-orchestrator/request-avatar-upload.module';
import { SetAvatarModule } from '../set-avatar-orchestrator/set-avatar.module';
import { RemoveAvatarModule } from '../remove-avatar-orchestrator/remove-avatar.module';
import { SignupModule } from '../signup-orchestrator/signup.module';
import { LoginModule } from '../login-orchestrator/login.module';
import { ListConversationsModule } from '../list-conversations-orchestrator/list-conversations.module';
import { CreateDmModule } from '../create-dm-orchestrator/create-dm.module';
import { CreateGroupModule } from '../create-group-orchestrator/create-group.module';
import { ListMessagesModule } from '../list-messages-orchestrator/list-messages.module';
import { SendMessageModule } from '../send-message-orchestrator/send-message.module';
import { SearchMessagesModule } from '../search-messages-orchestrator/search-messages.module';
import { GetRecentSearchesModule } from '../get-recent-searches-orchestrator/get-recent-searches.module';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import { ConversationsController } from './conversations.controller';
import { MessagesController } from './messages.controller';
import { SearchController } from './search.controller';

@Module({
  imports: [
    GetMeModule,
    GetContactsModule,
    UpdateProfileModule,
    UpdateEmailModule,
    RequestAvatarUploadModule,
    SetAvatarModule,
    RemoveAvatarModule,
    SignupModule,
    LoginModule,
    ListConversationsModule,
    CreateDmModule,
    CreateGroupModule,
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
