import { hasAnyRole, Roles, type Role } from '../auth/roles';

export interface NavItem {
  label: string;
  path: string;
  /** Roles that may see the item; empty = everyone signed in. */
  roles: readonly Role[];
  description: string;
}

/**
 * The left navigation, in order. Pages enforce the same roles through
 * RequireRole, and the API enforces them again; hiding a link is only a convenience.
 */
export const navItems: readonly NavItem[] = [
  {
    label: 'Browse trainings',
    path: '/',
    roles: [],
    description: 'Find trainings and register for sessions.',
  },
  {
    label: 'My trainings',
    path: '/my-trainings',
    roles: [],
    description: 'Upcoming, pending, waitlisted and past trainings, plus certificates.',
  },
  {
    // Phase 2: shown only to people who are someone's manager or assigned supervisor.
    label: 'Approvals',
    path: '/approvals',
    roles: [],
    description: 'Registration requests from your staff that need your decision.',
  },
  {
    label: 'My teaching',
    path: '/teaching',
    roles: [Roles.Trainer, Roles.Admin],
    description: 'Trainings you run: sessions, attendees and follow-up.',
  },
  {
    label: 'Admin',
    path: '/admin',
    roles: [Roles.Admin],
    description: 'Categories, locations, hotels, email templates, supervisors and roles.',
  },
];

export function visibleNavItems(userRoles: readonly string[]): NavItem[] {
  return navItems.filter((item) => hasAnyRole(userRoles, item.roles));
}
