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
import { CreateConversationModule } from '../create-conversation-orchestrator/create-conversation.module';
import { ListMessagesModule } from '../list-messages-orchestrator/list-messages.module';
import { SendMessageModule } from '../send-message-orchestrator/send-message.module';
import { SearchMessagesModule } from '../search-messages-orchestrator/search-messages.module';
import { GetRecentSearchesModule } from '../get-recent-searches-orchestrator/get-recent-searches.module';
import { StreamAssistantReplyModule } from '../stream-assistant-reply-orchestrator/stream-assistant-reply.module';
import { UploadKnowledgeDocumentModule } from '../upload-knowledge-document-orchestrator/upload-knowledge-document.module';
import { ListKnowledgeDocumentsModule } from '../list-knowledge-documents-orchestrator/list-knowledge-documents.module';
import { DeleteKnowledgeDocumentModule } from '../delete-knowledge-document-orchestrator/delete-knowledge-document.module';
import { RetrieveKnowledgeModule } from '../retrieve-knowledge-orchestrator/retrieve-knowledge.module';
import { GetKnowledgeChunkModule } from '../get-knowledge-chunk-orchestrator/get-knowledge-chunk.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
import { ConversationsController } from './conversations.controller';
import { MessagesController } from './messages.controller';
import { SearchController } from './search.controller';
import { AssistantController } from './assistant.controller';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeRetrievalController } from './knowledge-retrieval.controller';
import { KnowledgeChunkController } from './knowledge-chunk.controller';

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
    CreateConversationModule,
    ListMessagesModule,
    SendMessageModule,
    SearchMessagesModule,
    GetRecentSearchesModule,
    StreamAssistantReplyModule,
    UploadKnowledgeDocumentModule,
    ListKnowledgeDocumentsModule,
    DeleteKnowledgeDocumentModule,
    RetrieveKnowledgeModule,
    GetKnowledgeChunkModule,
    // AssistantConversationGuard (on AssistantController) injects
    // ConversationsService, so it must be resolvable in this module.
    ConversationsModule,
  ],
  controllers: [
    AuthController,
    UserController,
    ConversationsController,
    MessagesController,
    SearchController,
    AssistantController,
    KnowledgeController,
    KnowledgeRetrievalController,
    KnowledgeChunkController,
  ],
})
export class ControllersModule {}
