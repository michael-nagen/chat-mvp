import type { CSSProperties, HTMLInputTypeAttribute } from 'react';
import { TextField } from './TextField';

type FieldBinding = {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
};

type ContextFieldProps<T> = {
  /** The form context hook this field reads its slice from. */
  useFieldContext: () => T;
  /** Picks the value/onChange/disabled slice out of that context. */
  select: (context: T) => FieldBinding;
  type: HTMLInputTypeAttribute;
  placeholder: string;
  autoComplete: string;
  autoFocus?: boolean;
  style?: CSSProperties;
};

/**
 * A TextField bound to a form context: the field reads context itself (no value
 * drilling), and callers parameterize only which context and slice to read plus
 * the presentational attributes.
 */
export function ContextField<T>({
  useFieldContext,
  select,
  ...input
}: ContextFieldProps<T>): React.JSX.Element {
  const { value, onChange, disabled } = select(useFieldContext());
  return (
    <TextField
      {...input}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  );
}
