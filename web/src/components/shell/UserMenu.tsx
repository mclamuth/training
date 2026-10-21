import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { config } from '../../config';
import { signOut } from '../../auth/msal';
import { getDevRole, setDevRole } from '../../auth/devRole';
import { allRoles, type Role } from '../../auth/roles';
import { Icon } from '../ui/Icon';
import { useDismiss } from '../ui/useDismiss';
import type { Me } from '../../api/me';
import { initials } from '../../lib/initials';

/** Highest role first, as shown in the profile menu ("Admin", "Trainer" or "Employee"). */
function roleLabel(me: Me): string {
  const extra = me.roles.filter((r) => r !== 'Employee');
  const label = extra.length > 0 ? extra.join(', ') : 'Employee';
  return me.isOption2 ? `${label} · Option 2 staff` : label;
}

export function UserMenu({ me }: { me: Me }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, wrapRef);
  const queryClient = useQueryClient();

  const switchRole = async (role: Role) => {
    setDevRole(role);
    // Every cached answer depended on the old role.
    await queryClient.resetQueries();
  };

  const extraRoles = me.roles.filter((r) => r !== 'Employee');
  const currentDevRole = getDevRole() ?? (extraRoles.at(-1) as Role | undefined) ?? 'Employee';

  return (
    <div className="profile-wrap" ref={wrapRef}>
      <button type="button" aria-expanded={open} aria-haspopup="true" className="profile-trigger" onClick={() => setOpen((v) => !v)}>
        <span className="avatar" aria-hidden="true">
          {initials(me.displayName)}
        </span>
        <span>{me.displayName}</span>
        <Icon name="chevronDown" size={16} />
      </button>

      {open && (
        <div className="profile-menu">
          <div className="profile-heading">
            <span className="avatar avatar-large" aria-hidden="true">
              {initials(me.displayName)}
            </span>
            <div>
              <strong>{me.displayName}</strong>
              {me.email && <span>{me.email}</span>}
            </div>
          </div>
          <div className="profile-role">{roleLabel(me)}</div>

          {config.authMode === 'dev' && (
            <fieldset className="dev-role-switcher">
              <legend>Dev mode: view as</legend>
              {allRoles.map((role) => (
                <label key={role} className="choice">
                  <input
                    type="radio"
                    name="dev-role"
                    value={role}
                    checked={currentDevRole === role}
                    onChange={() => void switchRole(role)}
                  />
                  <span>{role}</span>
                </label>
              ))}
            </fieldset>
          )}

          {config.authMode === 'entra' && (
            <button type="button" className="sign-out" onClick={() => void signOut()}>
              Sign out
            </button>
          )}
        </div>
      )}
    </div>
  );
}
