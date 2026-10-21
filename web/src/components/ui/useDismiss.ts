import { useEffect, type RefObject } from 'react';

/**
 * Calls onDismiss when the user presses Escape or (optionally) clicks outside
 * `ref`. Used by menus, dialogs and drawers.
 */
export function useDismiss(
  active: boolean,
  onDismiss: () => void,
  ref?: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (ref?.current && !ref.current.contains(event.target as Node)) onDismiss();
    };

    document.addEventListener('keydown', onKeyDown);
    if (ref) document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (ref) document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [active, onDismiss, ref]);
}
