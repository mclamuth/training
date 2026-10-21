import { Link } from 'react-router';
import { config } from '../../config';
import { CtaLogo } from './CtaLogo';
import { AppLauncherIcon, MenuIcon } from './icons';
import { UserMenu } from './UserMenu';
import type { Me } from '../../api/me';

interface AppHeaderProps {
  me: Me | undefined;
  navOpen: boolean;
  onToggleNav: () => void;
}

/**
 * The CTA blue header shared with the Bug Tracking app: app launcher on the
 * left, logo centred, user menu on the right.
 *
 * TODO: swap for the shared header component from the Bug Tracking app once
 * that repo is available (see components/shell/README.md).
 */
export function AppHeader({ me, navOpen, onToggleNav }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header-start">
        {config.appLauncherUrl ? (
          <a className="header-icon-button" href={config.appLauncherUrl} aria-label="CTA apps">
            <AppLauncherIcon />
          </a>
        ) : (
          <button type="button" className="header-icon-button" aria-label="CTA apps" title="CTA apps">
            <AppLauncherIcon />
          </button>
        )}
        <button
          type="button"
          className="header-icon-button nav-toggle"
          aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={navOpen}
          aria-controls="side-nav"
          onClick={onToggleNav}
        >
          <MenuIcon />
        </button>
        <Link to="/" className="app-title">
          CTA Training
        </Link>
      </div>

      <div className="app-header-center">
        <CtaLogo />
      </div>

      <div className="app-header-end">{me && <UserMenu me={me} />}</div>
    </header>
  );
}
