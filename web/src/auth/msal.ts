import {
  EventType,
  InteractionRequiredAuthError,
  PublicClientApplication,
  type AuthenticationResult,
  type EventMessage,
} from '@azure/msal-browser';
import { config } from '../config';

/** The single MSAL instance. Only created in Entra mode. */
export let msalInstance: PublicClientApplication | null = null;

export const loginRequest = { scopes: [config.entra.apiScope] };

export async function initMsal(): Promise<PublicClientApplication> {
  const instance = new PublicClientApplication({
    auth: {
      clientId: config.entra.clientId,
      authority: `https://login.microsoftonline.com/${config.entra.tenantId}`,
      redirectUri: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
    },
    cache: { cacheLocation: 'sessionStorage' },
  });

  await instance.initialize();

  const [firstAccount] = instance.getAllAccounts();
  if (!instance.getActiveAccount() && firstAccount) {
    instance.setActiveAccount(firstAccount);
  }

  instance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      instance.setActiveAccount((event.payload as AuthenticationResult).account);
    }
  });

  msalInstance = instance;
  return instance;
}

/** An access token for the CTA Training API, or null in dev mode. */
export async function getApiAccessToken(): Promise<string | null> {
  if (!msalInstance) return null;

  const account = msalInstance.getActiveAccount();
  if (!account) {
    await msalInstance.loginRedirect(loginRequest);
    return null;
  }

  try {
    const result = await msalInstance.acquireTokenSilent({ ...loginRequest, account });
    return result.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.acquireTokenRedirect({ ...loginRequest, account });
      return null;
    }
    throw error;
  }
}

export async function signOut(): Promise<void> {
  await msalInstance?.logoutRedirect();
}
