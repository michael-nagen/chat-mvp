import { useState } from 'react';
import defaultAvatar from '../../assets/default-avatar.png';

type AvatarProps = {
  /** Public image URL; the bundled default is shown when missing or broken. */
  src: string | null;
  /** Display name — used for alt text. */
  name: string;
  /** Diameter in pixels. */
  size?: number;
};

/**
 * Round avatar shown across the app. The bundled default-avatar.png is the
 * single source of truth for "no avatar": it's shown when `src` is null/empty,
 * and also if a provided URL fails to load (onError).
 */
export function Avatar({ src, name, size = 36 }: AvatarProps): React.JSX.Element {
  const resolved = src && src.trim() !== '' ? src : defaultAvatar;
  // Track the URL that failed so a broken avatar falls back to the default,
  // while a later valid `src` still renders (resolved !== erroredSrc again).
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);
  const shown = resolved === erroredSrc ? defaultAvatar : resolved;

  return (
    <img
      src={shown}
      alt={name}
      onError={() => setErroredSrc(resolved)}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        objectFit: 'cover',
      }}
    />
  );
}
