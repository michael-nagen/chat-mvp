import type { User } from '../../../shared/entities/User.types';
import { post } from '../../../shared/api/apiClient';

export type AuthResponse = {
  token: string;
  user: User;
};

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/login', { email, password }, { auth: false });
}

export async function signup({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<AuthResponse> {
  return post<AuthResponse>(
    '/auth/signup',
    { email, password, firstName, lastName },
    { auth: false },
  );
}
