import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UserResponse } from '../user/user.types';
import { UpdateProfileOrchestrator } from './update-profile.orchestrator';

export interface UpdateProfileInput {
  userId: string;
  firstName: string;
  lastName: string;
}

export type UpdateProfileOutput = UserResponse;

@Module({
  imports: [UserModule],
  providers: [UpdateProfileOrchestrator],
  exports: [UpdateProfileOrchestrator],
})
export class UpdateProfileModule {}
