import { useAvatarFallback } from '../hooks/useAvatarFallback';
import { avatarStyles } from './Avatar.styles';

type AvatarProps = {
  /** Public image URL; the bundled default is shown when missing or broken. */
  src: string | null;
  /** Display name — used for alt text. */
  name: string;
  /** Diameter in pixels. */
  size?: number;
};

/** Round avatar shown across the app. */
export function Avatar({ src, name, size = 36 }: AvatarProps): React.JSX.Element {
  const { shown, onError } = useAvatarFallback({ src });

  return <img src={shown} alt={name} onError={onError} style={avatarStyles.image(size)} />;
}
