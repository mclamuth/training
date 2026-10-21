import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

/**
 * Status chip. Color always comes with words, never alone.
 * green = good / available, amber = needs attention, red = blocked or negative,
 * blue = informational or scheduled, gray = neutral or inactive.
 */
export type ChipTone = 'green' | 'amber' | 'red' | 'blue' | 'gray';

export function Chip({ tone = 'gray', children }: { tone?: ChipTone; children: ReactNode }) {
  return <span className={`chip chip-${tone}`}>{children}</span>;
}

export type TrainingFormat = 'Webinar' | 'On site' | 'On demand';

const formatIcons: Record<TrainingFormat, IconName> = {
  Webinar: 'webinar',
  'On site': 'onsite',
  'On demand': 'video',
};

export function FormatBadge({ format }: { format: TrainingFormat }) {
  return (
    <span className="format-badge">
      <Icon name={formatIcons[format]} size={16} />
      {format}
    </span>
  );
}
