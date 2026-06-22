import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { GetMeOrchestrator } from '../get-me-orchestrator/get-me.orchestrator';
import type { GetMeOutput } from '../get-me-orchestrator/get-me.module';
import { GetContactsOrchestrator } from '../get-contacts-orchestrator/get-contacts.orchestrator';
import type { GetContactsOutput } from '../get-contacts-orchestrator/get-contacts.module';
import { UpdateProfileOrchestrator } from '../update-profile-orchestrator/update-profile.orchestrator';
import type { UpdateProfileOutput } from '../update-profile-orchestrator/update-profile.module';
import { UpdateEmailOrchestrator } from '../update-email-orchestrator/update-email.orchestrator';
import type { UpdateEmailOutput } from '../update-email-orchestrator/update-email.module';
import { RequestAvatarUploadOrchestrator } from '../request-avatar-upload-orchestrator/request-avatar-upload.orchestrator';
import type { RequestAvatarUploadOutput } from '../request-avatar-upload-orchestrator/request-avatar-upload.module';
import { SetAvatarOrchestrator } from '../set-avatar-orchestrator/set-avatar.orchestrator';
import type { SetAvatarOutput } from '../set-avatar-orchestrator/set-avatar.module';
import { RemoveAvatarOrchestrator } from '../remove-avatar-orchestrator/remove-avatar.orchestrator';
import type { RemoveAvatarOutput } from '../remove-avatar-orchestrator/remove-avatar.module';
import { UpdateNameDto } from '../user/dto/update-name.dto';
import { UpdateEmailDto } from '../user/dto/update-email.dto';
import { PresignAvatarDto } from '../user/dto/presign-avatar.dto';
import { SetAvatarDto } from '../user/dto/set-avatar.dto';

@Controller()
export class UserController {
  constructor(
    private readonly getMe: GetMeOrchestrator,
    private readonly getContacts: GetContactsOrchestrator,
    private readonly updateProfile: UpdateProfileOrchestrator,
    private readonly updateEmail: UpdateEmailOrchestrator,
    private readonly requestAvatarUpload: RequestAvatarUploadOrchestrator,
    private readonly setAvatar: SetAvatarOrchestrator,
    private readonly removeAvatar: RemoveAvatarOrchestrator,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthUser): Promise<GetMeOutput> {
    return this.getMe.execute({ userId: user.userId });
  }

  // The contacts the New Conversation flow lists; participants are restricted
  // to this set server-side on conversation creation.
  @UseGuards(JwtAuthGuard)
  @Get('me/contacts')
  myContacts(@CurrentUser() user: AuthUser): Promise<GetContactsOutput> {
    return this.getContacts.execute({ userId: user.userId });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/name')
  updateMyName(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateNameDto,
  ): Promise<UpdateProfileOutput> {
    return this.updateProfile.execute({
      userId: user.userId,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/email')
  updateMyEmail(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateEmailDto,
  ): Promise<UpdateEmailOutput> {
    return this.updateEmail.execute({ userId: user.userId, email: dto.email });
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/avatar/presign')
  presignAvatar(
    @CurrentUser() user: AuthUser,
    @Body() dto: PresignAvatarDto,
  ): Promise<RequestAvatarUploadOutput> {
    return this.requestAvatarUpload.execute({
      userId: user.userId,
      contentType: dto.contentType,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/avatar')
  setMyAvatar(
    @CurrentUser() user: AuthUser,
    @Body() dto: SetAvatarDto,
  ): Promise<SetAvatarOutput> {
    return this.setAvatar.execute({ userId: user.userId, key: dto.key });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/avatar')
  removeMyAvatar(@CurrentUser() user: AuthUser): Promise<RemoveAvatarOutput> {
    return this.removeAvatar.execute({ userId: user.userId });
  }
}
