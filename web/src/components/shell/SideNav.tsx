import { Link, useLocation } from 'react-router';
import { isNavItemActive, visibleNavItems } from '../../app/navigation';
import { Icon } from '../ui/Icon';

export function SideNav({ roles }: { roles: readonly string[] }) {
  const { pathname } = useLocation();
  const items = visibleNavItems(roles);

  return (
    <aside className="sidebar">
      <nav aria-label="Main navigation">
        {items.map((item) => {
          const active = isNavItemActive(item, pathname);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item${active ? ' active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <Link
          to="/design-system"
          className={`design-link${pathname === '/design-system' ? ' active' : ''}`}
          aria-current={pathname === '/design-system' ? 'page' : undefined}
        >
          <Icon name="info" />
          <span>Design system</span>
        </Link>
        <span className="version">CTA Training · v{__APP_VERSION__}</span>
      </div>
    </aside>
  );
}
