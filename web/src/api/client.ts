import { config } from '../config';
import { getApiAccessToken } from '../auth/msal';
import { getDevRole } from '../auth/devRole';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Calls the CTA Training API with the signed-in user's credentials. */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  if (config.authMode === 'entra') {
    const token = await getApiAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  } else {
    const role = getDevRole();
    if (role) headers.set('X-Dev-Role', role);
  }

  const response = await fetch(path, { ...init, headers });

  if (!response.ok) {
    // The API returns RFC 7807 problem details; show their title when present.
    let message = response.statusText || `Request failed (${response.status})`;
    try {
      const problem = (await response.json()) as { title?: string; detail?: string };
      message = problem.detail ?? problem.title ?? message;
    } catch {
      // Not JSON; keep the status text.
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
