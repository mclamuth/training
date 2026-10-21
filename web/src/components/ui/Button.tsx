import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'destructive';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: IconName;
  children: ReactNode;
}

/** Design system button. Defaults to type="button" so it never submits a form by accident. */
export function Button({ variant = 'primary', icon, children, className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={`button button-${variant}${className ? ` ${className}` : ''}`} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Accessible name; also shown as the tooltip. */
  label: string;
  icon: IconName;
  expanded?: boolean;
}

export function IconButton({ label, icon, expanded, className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-expanded={expanded}
      aria-label={label}
      title={label}
      className={`icon-button${className ? ` ${className}` : ''}`}
      {...rest}
    >
      <Icon name={icon} />
    </button>
  );
}
