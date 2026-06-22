import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AuthResult } from '../auth/auth.types';
import { LoginOrchestrator } from './login.orchestrator';

export interface LoginInput {
  email: string;
  password: string;
}

export type LoginOutput = AuthResult;

@Module({
  imports: [UserModule, AuthModule],
  providers: [LoginOrchestrator],
  exports: [LoginOrchestrator],
})
export class LoginModule {}
