import { hasAnyRole, Roles, type Role } from '../auth/roles';
import type { IconName } from '../components/ui/Icon';

export interface NavItem {
  label: string;
  path: string;
  icon: IconName;
  /** Roles that may see the item; empty = everyone signed in. */
  roles: readonly Role[];
  /** Other paths that should highlight this item (detail pages under it). */
  activeFor?: readonly string[];
}

/**
 * The left navigation, in order. Pages enforce the same roles through
 * RequireRole, and the API enforces them again; hiding a link is only a convenience.
 */
export const navItems: readonly NavItem[] = [
  { label: 'Browse trainings', path: '/', icon: 'search', roles: [], activeFor: ['/trainings/'] },
  { label: 'My trainings', path: '/my-trainings', icon: 'book', roles: [] },
  // Phase 4: shown only to people who are someone's manager or assigned supervisor.
  { label: 'Approvals', path: '/approvals', icon: 'approvals', roles: [] },
  { label: 'My teaching', path: '/teaching', icon: 'teach', roles: [Roles.Trainer, Roles.Admin] },
  { label: 'Admin', path: '/admin', icon: 'admin', roles: [Roles.Admin] },
];

export function visibleNavItems(userRoles: readonly string[]): NavItem[] {
  return navItems.filter((item) => hasAnyRole(userRoles, item.roles));
}

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.path === '/') return pathname === '/' || (item.activeFor ?? []).some((p) => pathname.startsWith(p));
  return pathname === item.path || pathname.startsWith(`${item.path}/`) || (item.activeFor ?? []).some((p) => pathname.startsWith(p));
}
