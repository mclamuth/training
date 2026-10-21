import { createContext, useContext } from 'react';

export type ShowToast = (title: string, message?: string) => void;

export const ToastContext = createContext<ShowToast | null>(null);

/** Shows a confirmation toast. Must be used inside <ToastProvider>. */
export function useToast(): ShowToast {
  const show = useContext(ToastContext);
  if (!show) throw new Error('useToast must be used inside <ToastProvider>.');
  return show;
}
