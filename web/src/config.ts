import type { IconName } from './components/ui/Icon';

export type AuthMode = 'entra' | 'dev';

function readAuthMode(): AuthMode {
  const value = import.meta.env.VITE_AUTH_MODE?.toLowerCase();
  if (value === 'entra' || value === 'dev') return value;
  // `npm run dev` defaults to the fake dev user; production builds never do.
  return import.meta.env.DEV ? 'dev' : 'entra';
}

export interface LauncherApp {
  name: string;
  url: string;
  icon: IconName;
}

/** Other CTA apps in the header's app launcher. An app is listed only when its URL is configured. */
function readLauncherApps(): LauncherApp[] {
  const apps: LauncherApp[] = [];
  if (import.meta.env.VITE_BUG_TRACKING_URL) {
    apps.push({ name: 'Bug Tracking', url: import.meta.env.VITE_BUG_TRACKING_URL, icon: 'approvals' });
  }
  return apps;
}

export const config = {
  authMode: readAuthMode(),
  entra: {
    tenantId: import.meta.env.VITE_ENTRA_TENANT_ID ?? '',
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID ?? '',
    apiScope: import.meta.env.VITE_API_SCOPE ?? '',
  },
  launcherApps: readLauncherApps(),
} as const;

/** Names of missing settings that Entra sign-in needs; empty when ready. */
export function missingEntraSettings(): string[] {
  const missing: string[] = [];
  if (!config.entra.tenantId) missing.push('VITE_ENTRA_TENANT_ID');
  if (!config.entra.clientId) missing.push('VITE_ENTRA_CLIENT_ID');
  if (!config.entra.apiScope) missing.push('VITE_API_SCOPE');
  return missing;
}
