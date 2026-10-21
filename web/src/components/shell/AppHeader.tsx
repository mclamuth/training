import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router';
import { config } from '../../config';
import { Icon } from '../ui/Icon';
import { IconButton } from '../ui/Button';
import { useDismiss } from '../ui/useDismiss';
import { UserMenu } from './UserMenu';
import type { Me } from '../../api/me';

/** The shared CTA header: app launcher and app name on the left, CTA logo centred, profile on the right. */
export function AppHeader({ me }: { me: Me | undefined }) {
  const [launcherOpen, setLauncherOpen] = useState(false);
  const launcherRef = useRef<HTMLDivElement>(null);
  const closeLauncher = useCallback(() => setLauncherOpen(false), []);
  useDismiss(launcherOpen, closeLauncher, launcherRef);

  return (
    <header className="topbar">
      <div className="topbar-left" ref={launcherRef}>
        <IconButton
          className="header-icon"
          icon="apps"
          label="Open app launcher"
          expanded={launcherOpen}
          onClick={() => setLauncherOpen((open) => !open)}
        />
        <span className="header-divider" />
        <Link to="/" className="brand-name">
          CTA Training
        </Link>

        {launcherOpen && (
          <div className="launcher-panel">
            <div className="launcher-title">CTA apps</div>
            <Link to="/" onClick={closeLauncher}>
              <Icon name="book" /> CTA Training
            </Link>
            {config.launcherApps.map((app) => (
              <a key={app.name} href={app.url} target="_blank" rel="noreferrer" onClick={closeLauncher}>
                <Icon name={app.icon} /> {app.name} <Icon name="external" size={16} />
              </a>
            ))}
          </div>
        )}
      </div>

      <img alt="California Teachers Association" className="cta-logo" src="/cta-logo-white.png" />

      {me ? <UserMenu me={me} /> : <div className="profile-wrap" />}
    </header>
  );
}
