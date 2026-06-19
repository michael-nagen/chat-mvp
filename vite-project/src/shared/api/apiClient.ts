import type { RequestOptions, HelperOptions } from './apiClient.types';
import { buildQuery } from './apiClient.utils';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

// Token source is injected at startup so this client stays independent of the auth feature.
let getToken: () => string | null = () => null;

export function setTokenProvider(fn: () => string | null): void {
  getToken = fn;
}

function extractErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'error' in body) {
    const error = (body as { error: unknown }).error;
    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as { message: unknown }).message;
      if (typeof message === 'string') return message;
    }
  }
  return fallback;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, query } = options;
  const headers: Record<string, string> = {};

  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}${buildQuery(query)}`, {
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

export const get = <T>(path: string, options?: HelperOptions): Promise<T> =>
  request<T>(path, { ...options, method: 'GET' });

export const post = <T>(path: string, body?: unknown, options?: HelperOptions): Promise<T> =>
  request<T>(path, { ...options, method: 'POST', body });

export const patch = <T>(path: string, body?: unknown, options?: HelperOptions): Promise<T> =>
  request<T>(path, { ...options, method: 'PATCH', body });

export const put = <T>(path: string, body?: unknown, options?: HelperOptions): Promise<T> =>
  request<T>(path, { ...options, method: 'PUT', body });

export const del = <T>(path: string, options?: HelperOptions): Promise<T> =>
  request<T>(path, { ...options, method: 'DELETE' });
