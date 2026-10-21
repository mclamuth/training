import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Icon } from './Icon';
import { IconButton } from './Button';
import { ToastContext, type ShowToast } from './toastContext';

interface ToastMessage {
  id: number;
  title: string;
  message?: string;
}

const autoDismissMs = 4000;

/** One toast at a time, bottom of the screen, announced to screen readers. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const show = useCallback<ShowToast>((title, message) => {
    setToast({ id: Date.now(), title, message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), autoDismissMs);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite">
        {toast && (
          <div className="toast" key={toast.id}>
            <span className="toast-icon">
              <Icon name="check" size={18} />
            </span>
            <div>
              <strong>{toast.title}</strong>
              {toast.message && <span>{toast.message}</span>}
            </div>
            <IconButton icon="close" label="Dismiss notification" onClick={() => setToast(null)} />
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
