import { profileStyles } from './Profile.styles';
import type { SecondaryButtonProps } from './ProfileFields.types';

export function SecondaryButton({
  label,
  disabled,
  onClick,
}: SecondaryButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={profileStyles.secondaryButton(!disabled)}
    >
      {label}
    </button>
  );
}
