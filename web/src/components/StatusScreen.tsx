import type { ReactNode } from 'react';

/** Full-page message used before the shell can render (signing in, config errors). */
export function StatusScreen({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <main className="status-screen" aria-live="polite">
      <h1>{title}</h1>
      {children}
    </main>
  );
}
