import { describe, expect, it } from 'vitest';
import { visibleNavItems } from './navigation';

const labels = (roles: string[]) => visibleNavItems(roles).map((item) => item.label);

describe('visibleNavItems', () => {
  it('shows employees the shared pages only', () => {
    expect(labels(['Employee'])).toEqual(['Browse trainings', 'My trainings', 'Approvals']);
  });

  it('adds My teaching for trainers', () => {
    expect(labels(['Employee', 'Trainer'])).toContain('My teaching');
    expect(labels(['Employee', 'Trainer'])).not.toContain('Admin');
  });

  it('shows admins everything', () => {
    expect(labels(['Employee', 'Admin'])).toEqual([
      'Browse trainings',
      'My trainings',
      'Approvals',
      'My teaching',
      'Admin',
    ]);
  });
});
