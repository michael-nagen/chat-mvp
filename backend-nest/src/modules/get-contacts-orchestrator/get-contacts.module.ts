import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UserSummary } from '../user/user.types';
import { GetContactsOrchestrator } from './get-contacts.orchestrator';

export interface GetContactsInput {
  userId: string;
}

export type GetContactsOutput = UserSummary[];

@Module({
  imports: [UserModule],
  providers: [GetContactsOrchestrator],
  exports: [GetContactsOrchestrator],
})
export class GetContactsModule {}
