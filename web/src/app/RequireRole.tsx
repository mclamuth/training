import type { ReactNode } from 'react';
import { useOutletContext } from 'react-router';
import { hasAnyRole, type Role } from '../auth/roles';
import type { Me } from '../api/me';

/** Shows a friendly "not available" page when the user lacks the role. */
export function RequireRole({ roles, children }: { roles: readonly Role[]; children: ReactNode }) {
  const me = useOutletContext<Me>();

  if (!hasAnyRole(me.roles, roles)) {
    return (
      <section className="page" aria-labelledby="page-title">
        <h1 id="page-title">This page isn't available to you</h1>
        <p className="page-description">
          It's for {roles.join(' or ').toLowerCase()}s. If you need access, ask a CTA Training admin.
        </p>
      </section>
    );
  }

  return <>{children}</>;
}
