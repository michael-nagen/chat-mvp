import { Module } from '@nestjs/common';
import { AvatarModule } from '../avatar/avatar.module';
import { PresignedAvatarUpload } from '../avatar/avatar.types';
import { RequestAvatarUploadOrchestrator } from './request-avatar-upload.orchestrator';

export interface RequestAvatarUploadInput {
  userId: string;
  contentType: string;
}

export type RequestAvatarUploadOutput = PresignedAvatarUpload;

@Module({
  imports: [AvatarModule],
  providers: [RequestAvatarUploadOrchestrator],
  exports: [RequestAvatarUploadOrchestrator],
})
export class RequestAvatarUploadModule {}
