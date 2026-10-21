import { NavLink } from 'react-router';
import { visibleNavItems } from '../../app/navigation';

interface SideNavProps {
  roles: readonly string[];
  open: boolean;
  onNavigate: () => void;
}

export function SideNav({ roles, open, onNavigate }: SideNavProps) {
  const items = visibleNavItems(roles);

  return (
    <nav id="side-nav" className={open ? 'side-nav side-nav-open' : 'side-nav'} aria-label="Main">
      <ul>
        {items.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
              onClick={onNavigate}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
