import type { User } from '../../shared/entities/User.types';
import { requestLogin } from '../../shared/api/apiClient';

export type LoginResponse = {
  token: string;
  user: User;
};

export async function loginByName(name: string): Promise<LoginResponse> {
  return requestLogin(name);
}
