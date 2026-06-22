import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UserResponse } from '../user/user.types';
import { UpdateEmailOrchestrator } from './update-email.orchestrator';

export interface UpdateEmailInput {
  userId: string;
  email: string;
}

export type UpdateEmailOutput = UserResponse;

@Module({
  imports: [UserModule],
  providers: [UpdateEmailOrchestrator],
  exports: [UpdateEmailOrchestrator],
})
export class UpdateEmailModule {}
