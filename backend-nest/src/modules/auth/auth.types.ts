import { UserResponse } from '../user/user.types';

export interface AuthResult {
  user: UserResponse;
  token: string;
}
