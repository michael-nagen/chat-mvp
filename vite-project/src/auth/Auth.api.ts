import type { User } from '../entities/User.types';
import { requestLogin } from '../shared/chatApi/apiClient';

export type LoginResponse = {
  token: string;
  user: User;
};

export async function loginByName(name: string): Promise<LoginResponse> {
  return requestLogin(name);
}
