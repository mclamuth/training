import type { ReactNode } from 'react';
import { InteractionType } from '@azure/msal-browser';
import { MsalAuthenticationTemplate, MsalProvider, type MsalAuthenticationResult } from '@azure/msal-react';
import { config, missingEntraSettings } from '../config';
import { loginRequest, msalInstance } from './msal';
import { StatusScreen } from '../components/StatusScreen';

function SignInError({ error }: MsalAuthenticationResult) {
  return (
    <StatusScreen title="We couldn't sign you in">
      <p>{error?.errorMessage ?? 'Something went wrong while signing in with your CTA account.'}</p>
      <p>
        <button type="button" className="button" onClick={() => window.location.reload()}>
          Try again
        </button>
      </p>
    </StatusScreen>
  );
}

function SigningIn() {
  return <StatusScreen title="Signing you in…" />;
}

/**
 * Entra mode: everything inside requires a signed-in CTA account.
 * Dev mode: renders straight through; the API signs requests in as the dev user.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  if (config.authMode === 'dev') return <>{children}</>;

  const missing = missingEntraSettings();
  if (missing.length > 0 || !msalInstance) {
    return (
      <StatusScreen title="Sign-in isn't configured">
        <p>Set these build settings, then rebuild: {missing.join(', ') || 'MSAL failed to start'}.</p>
      </StatusScreen>
    );
  }

  return (
    <MsalProvider instance={msalInstance}>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={loginRequest}
        loadingComponent={SigningIn}
        errorComponent={SignInError}
      >
        {children}
      </MsalAuthenticationTemplate>
    </MsalProvider>
  );
}
