import { SecondaryButton } from '../../shared/SecondaryButton';
import { useProfileAvatarContext } from '../ProfileAvatar.context';

export function ProfileAvatarRemoveButton(): React.JSX.Element | null {
  const { hasAvatar, isBusy, onRemove } = useProfileAvatarContext();
  if (!hasAvatar) return null;
  return <SecondaryButton label="Remove" disabled={isBusy} onClick={() => void onRemove()} />;
}
