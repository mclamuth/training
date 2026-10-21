import type { ReactNode } from 'react';
import { Icon, type IconName } from './ui/Icon';

interface PagePlaceholderProps {
  title: string;
  description: string;
  /** Which build step delivers the real page. */
  phase: string;
  icon: IconName;
  children?: ReactNode;
}

/** Stand-in for screens that later build steps implement from the approved design. */
export function PagePlaceholder({ title, description, phase, icon, children }: PagePlaceholderProps) {
  return (
    <div className="placeholder-page">
      <div className="page-heading">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      <div className="empty-state">
        <span className="empty-icon">
          <Icon name={icon} />
        </span>
        <h3>Coming in {phase}</h3>
        {children}
      </div>
    </div>
  );
}
