import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UserResponse } from '../user/user.types';
import { GetMeOrchestrator } from './get-me.orchestrator';

export interface GetMeInput {
  userId: string;
}

export type GetMeOutput = UserResponse;

@Module({
  imports: [UserModule],
  providers: [GetMeOrchestrator],
  exports: [GetMeOrchestrator],
})
export class GetMeModule {}
