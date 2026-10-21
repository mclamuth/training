import { allRoles, type Role } from './roles';

/**
 * Dev mode only: which role the fake user plays. Sent to the API as the
 * X-Dev-Role header. Stored per browser; storage can be unavailable, so every
 * access is guarded and the app falls back to the API's configured role.
 */
const storageKey = 'cta-training.dev-role';

export function getDevRole(): Role | null {
  try {
    const value = window.localStorage.getItem(storageKey);
    return allRoles.find((role) => role === value) ?? null;
  } catch {
    return null;
  }
}

export function setDevRole(role: Role | null): void {
  try {
    if (role) window.localStorage.setItem(storageKey, role);
    else window.localStorage.removeItem(storageKey);
  } catch {
    // Storage blocked: the switch lasts until reload via the in-memory query cache only.
  }
}
