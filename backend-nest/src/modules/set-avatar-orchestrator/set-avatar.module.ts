import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UserResponse } from '../user/user.types';
import { AvatarModule } from '../avatar/avatar.module';
import { SetAvatarOrchestrator } from './set-avatar.orchestrator';

export interface SetAvatarInput {
  userId: string;
  key: string;
}

export type SetAvatarOutput = UserResponse;

@Module({
  imports: [UserModule, AvatarModule],
  providers: [SetAvatarOrchestrator],
  exports: [SetAvatarOrchestrator],
})
export class SetAvatarModule {}
