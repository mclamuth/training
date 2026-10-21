import { useEffect, useId, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { config } from '../../config';
import { signOut } from '../../auth/msal';
import { getDevRole, setDevRole } from '../../auth/devRole';
import { allRoles, type Role } from '../../auth/roles';
import type { Me } from '../../api/me';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

export function UserMenu({ me }: { me: Me }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const switchRole = async (role: Role) => {
    setDevRole(role);
    // Every cached answer depended on the old role.
    await queryClient.resetQueries();
  };

  const devRole = getDevRole();
  const extraRoles = me.roles.filter((r) => r !== 'Employee');

  return (
    <div className="user-menu" ref={containerRef}>
      <button
        type="button"
        className="user-menu-button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="avatar" aria-hidden="true">
          {initials(me.displayName)}
        </span>
        <span className="user-menu-name">{me.displayName}</span>
      </button>

      {open && (
        <div className="user-menu-panel" id={menuId}>
          <p className="user-menu-who">
            <strong>{me.displayName}</strong>
            {me.email && <span>{me.email}</span>}
            <span className="user-menu-roles">
              {extraRoles.length > 0 ? extraRoles.join(', ') : 'Employee'}
              {me.isOption2 && ' · Option 2 staff'}
            </span>
          </p>

          {config.authMode === 'dev' && (
            <fieldset className="dev-role-switcher">
              <legend>Dev mode: view as</legend>
              {allRoles.map((role) => (
                <label key={role}>
                  <input
                    type="radio"
                    name="dev-role"
                    value={role}
                    checked={(devRole ?? (extraRoles.at(-1) as Role | undefined) ?? 'Employee') === role}
                    onChange={() => void switchRole(role)}
                  />
                  {role}
                </label>
              ))}
            </fieldset>
          )}

          {config.authMode === 'entra' && (
            <button type="button" className="button button-secondary" onClick={() => void signOut()}>
              Sign out
            </button>
          )}
        </div>
      )}
    </div>
  );
}
