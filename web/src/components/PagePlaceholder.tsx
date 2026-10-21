import type { ReactNode } from 'react';

interface PagePlaceholderProps {
  title: string;
  description: string;
  /** Which delivery phase builds the real page. */
  phase: string;
  children?: ReactNode;
}

/** Stand-in for pages that later phases build out from the Figma designs. */
export function PagePlaceholder({ title, description, phase, children }: PagePlaceholderProps) {
  return (
    <section className="page" aria-labelledby="page-title">
      <header className="page-header">
        <h1 id="page-title">{title}</h1>
        <p className="page-description">{description}</p>
      </header>
      <div className="placeholder-card">
        <p className="placeholder-phase">Coming in {phase}</p>
        {children}
      </div>
    </section>
  );
}
