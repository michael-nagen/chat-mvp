import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ConversationParticipantsResolver } from './conversation-participants.resolver';

@Module({
  imports: [UserModule],
  providers: [ConversationParticipantsResolver],
  exports: [ConversationParticipantsResolver],
})
export class ConversationParticipantsModule {}
