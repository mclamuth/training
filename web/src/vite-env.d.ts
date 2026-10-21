/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "entra" (default in builds) or "dev" (default in `npm run dev`). */
  readonly VITE_AUTH_MODE?: string;
  readonly VITE_ENTRA_TENANT_ID?: string;
  /** Client ID of the SPA app registration. */
  readonly VITE_ENTRA_CLIENT_ID?: string;
  /** The API's delegated scope, e.g. api://<api-client-id>/access_as_user */
  readonly VITE_API_SCOPE?: string;
  /** Bug Tracking app URL, listed in the header's app launcher. */
  readonly VITE_BUG_TRACKING_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** App version from package.json, injected by vite.config.ts. */
declare const __APP_VERSION__: string;
