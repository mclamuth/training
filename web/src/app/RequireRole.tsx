import type { ReactNode } from 'react';
import { Link, useOutletContext } from 'react-router';
import { hasAnyRole, type Role } from '../auth/roles';
import { Icon } from '../components/ui/Icon';
import type { Me } from '../api/me';

/** Shows a friendly "not available" page when the user lacks the role. */
export function RequireRole({ roles, children }: { roles: readonly Role[]; children: ReactNode }) {
  const me = useOutletContext<Me>();

  if (!hasAnyRole(me.roles, roles)) {
    return (
      <div className="empty-state">
        <span className="empty-icon">
          <Icon name="info" />
        </span>
        <h1>This page isn't available to you</h1>
        <p>
          It's for {roles.join(' or ').toLowerCase()}s. If you need access, ask a CTA Training admin.
        </p>
        <Link className="button button-secondary" to="/">
          Browse trainings
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
