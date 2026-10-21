import { useState } from 'react';
import { Outlet } from 'react-router';
import { useMe } from '../../api/me';
import { AppHeader } from './AppHeader';
import { SideNav } from './SideNav';

/** Layout for every signed-in page: header, left navigation, main content. */
export function AppShell() {
  const me = useMe();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <AppHeader me={me.data} navOpen={navOpen} onToggleNav={() => setNavOpen((v) => !v)} />
      <div className="app-body">
        <SideNav roles={me.data?.roles ?? []} open={navOpen} onNavigate={() => setNavOpen(false)} />
        <main id="main" className="app-main" tabIndex={-1}>
          {me.isPending && <p className="loading">Loading…</p>}
          {me.isError && (
            <div className="alert" role="alert">
              <strong>We couldn't load your account.</strong> {me.error.message}
            </div>
          )}
          {me.isSuccess && <Outlet context={me.data} />}
        </main>
      </div>
    </div>
  );
}
