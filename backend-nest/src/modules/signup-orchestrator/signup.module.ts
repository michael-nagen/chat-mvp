import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AuthResult } from '../auth/auth.types';
import { SignupOrchestrator } from './signup.orchestrator';

export interface SignupInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export type SignupOutput = AuthResult;

@Module({
  imports: [UserModule, AuthModule],
  providers: [SignupOrchestrator],
  exports: [SignupOrchestrator],
})
export class SignupModule {}
