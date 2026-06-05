import type { Conversation } from '../entities/Conversation.types';
import type { Message } from '../entities/Message.types';
import type { User } from '../entities/User.types';
import { AUTH_STORAGE_KEY } from '../../features/auth/model/Auth.constants';

// Base URL of the backend API. Override with VITE_API_BASE_URL for other envs.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

/** Reads the persisted auth token so authenticated requests can attach it. */
function readToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: string };
    return typeof parsed.token === 'string' ? parsed.token : null;
  } catch {
    return null;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

/** Pulls a human-readable message out of either error envelope shape. */
function extractErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'error' in body) {
    const error = (body as { error: unknown }).error;
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as { message: unknown }).message;
      if (typeof message === 'string') return message;
    }
  }
  return fallback;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;
  const headers: Record<string, string> = {};

  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = readToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(payload, `Request failed (${res.status})`));
  }

  return payload as T;
}

export async function requestLogin(name: string): Promise<{ token: string; user: User }> {
  return request('/auth/login', { method: 'POST', body: { name }, auth: false });
}

export async function requestConversations(
  _userId: string,
): Promise<{ conversations: Conversation[] }> {
  // The backend identifies the user from the auth token, so userId isn't sent.
  return request('/conversations');
}

export async function requestMessages(
  conversationId: string,
  cursor?: string,
  limit?: number,
): Promise<{ messages: Message[]; nextCursor: string | null }> {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  if (limit !== undefined) params.set('limit', String(limit));
  const query = params.toString();
  return request(`/conversations/${conversationId}/messages${query ? `?${query}` : ''}`);
}

export async function requestSendMessage(
  conversationId: string,
  content: string,
): Promise<{ message: Message }> {
  return request(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: { content },
  });
}
