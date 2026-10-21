import { Outlet } from 'react-router';
import { useMe } from '../../api/me';
import { ToastProvider } from '../ui/Toast';
import { AppHeader } from './AppHeader';
import { SideNav } from './SideNav';

/** Layout for every signed-in page: CTA header, left navigation, main content. */
export function AppShell() {
  const me = useMe();

  return (
    <ToastProvider>
      <div className="app">
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <AppHeader me={me.data} />
        <div className="workspace">
          <SideNav roles={me.data?.roles ?? []} />
          <main id="main" className="main-content" tabIndex={-1}>
            {me.isPending && <p className="loading-text">Loading…</p>}
            {me.isError && (
              <div className="alert" role="alert">
                <strong>We couldn't load your account.</strong> {me.error.message}
              </div>
            )}
            {me.isSuccess && <Outlet context={me.data} />}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
