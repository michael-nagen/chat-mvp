import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UserResponse } from '../user/user.types';
import { AvatarModule } from '../avatar/avatar.module';
import { RemoveAvatarOrchestrator } from './remove-avatar.orchestrator';

export interface RemoveAvatarInput {
  userId: string;
}

export type RemoveAvatarOutput = UserResponse;

@Module({
  imports: [UserModule, AvatarModule],
  providers: [RemoveAvatarOrchestrator],
  exports: [RemoveAvatarOrchestrator],
})
export class RemoveAvatarModule {}
