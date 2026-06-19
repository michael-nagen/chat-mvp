import type { CSSProperties, HTMLInputTypeAttribute } from 'react';
import { colors } from '../styles/colors';

type TextFieldProps = {
  type: HTMLInputTypeAttribute;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
  disabled: boolean;
  autoFocus?: boolean;
  /** Merged over the base input style for per-feature tweaks. */
  style?: CSSProperties;
};

const baseInput: CSSProperties = {
  padding: '10px 12px',
  borderRadius: '6px',
  border: `1px solid ${colors.border}`,
  outline: 'none',
};

/** Controlled text input shared across forms; emits the raw string value. */
export function TextField({
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  autoFocus,
  style,
}: TextFieldProps): React.JSX.Element {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      autoFocus={autoFocus}
      style={{ ...baseInput, ...style }}
    />
  );
}
