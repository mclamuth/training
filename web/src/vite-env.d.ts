/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "entra" (default in builds) or "dev" (default in `npm run dev`). */
  readonly VITE_AUTH_MODE?: string;
  readonly VITE_ENTRA_TENANT_ID?: string;
  /** Client ID of the SPA app registration. */
  readonly VITE_ENTRA_CLIENT_ID?: string;
  /** The API's delegated scope, e.g. api://<api-client-id>/access_as_user */
  readonly VITE_API_SCOPE?: string;
  /** Where the header's app launcher goes. Matches the Bug Tracking app. */
  readonly VITE_APP_LAUNCHER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
