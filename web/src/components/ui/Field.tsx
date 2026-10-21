import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  /** Guidance shown under the control. */
  help?: string;
  /** Validation message; replaces the help text and turns the field red. */
  error?: string;
  children: ReactNode;
}

/** Labelled form control with room for help or error text. Wrap one input, select or textarea. */
export function Field({ label, help, error, children }: FieldProps) {
  return (
    <label className={`field${error ? ' field-error' : ''}`}>
      <span className="field-label">{label}</span>
      {children}
      <span className={error ? 'error-text' : 'help-text'}>{error ?? help}</span>
    </label>
  );
}
