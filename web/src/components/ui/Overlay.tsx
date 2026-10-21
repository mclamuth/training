import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react';
import { IconButton } from './Button';
import { useDismiss } from './useDismiss';

interface OverlayProps {
  title: string;
  /** Small label above the title. */
  eyebrow?: string;
  description?: ReactNode;
  onClose: () => void;
  /** Footer buttons. */
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/** Moves focus into the panel when it opens and back to the opener when it closes. */
function useFocusReturn(panelRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => opener?.focus?.();
  }, [panelRef]);
}

function Heading({ id, title, eyebrow, description, onClose, closeLabel }: {
  id: string;
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  onClose: () => void;
  closeLabel: string;
}) {
  return (
    <div className="overlay-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2 id={id}>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      <IconButton icon="close" label={closeLabel} onClick={onClose} />
    </div>
  );
}

/** Centered modal dialog. Closes on Escape or a click on the backdrop. */
export function Dialog({ title, eyebrow, description, onClose, actions, className, children }: OverlayProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  useDismiss(true, onClose);
  useFocusReturn(panelRef);

  return (
    <div className="overlay" role="presentation" onMouseDown={onClose}>
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`dialog${className ? ` ${className}` : ''}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Heading id={titleId} title={title} eyebrow={eyebrow} description={description} onClose={onClose} closeLabel="Close dialog" />
        {children}
        {actions && <div className="overlay-actions">{actions}</div>}
      </div>
    </div>
  );
}

/** Side panel that slides in from the right. Closes on Escape or a click outside. */
export function Drawer({ title, eyebrow, description, onClose, actions, className, children }: OverlayProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  useDismiss(true, onClose);
  useFocusReturn(panelRef);

  return (
    <div className="overlay drawer-overlay" role="presentation" onMouseDown={onClose}>
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`drawer${className ? ` ${className}` : ''}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Heading id={titleId} title={title} eyebrow={eyebrow} description={description} onClose={onClose} closeLabel="Close side panel" />
        <div className="drawer-content">{children}</div>
        {actions && <div className="drawer-actions">{actions}</div>}
      </aside>
    </div>
  );
}
