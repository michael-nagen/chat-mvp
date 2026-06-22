import { useState } from 'react';
import defaultAvatar from '../../assets/default-avatar.png';

type UseAvatarFallbackArgs = {
  /** Public image URL; null/empty or a failed load falls back to the bundled default. */
  src: string | null;
};

type AvatarFallback = {
  shown: string;
  onError: () => void;
};

// The bundled default-avatar.png is the single source of truth for "no avatar":
// shown when `src` is null/empty and when a provided URL fails to load, while a
// later valid `src` still renders (resolved !== erroredSrc again).
export function useAvatarFallback({ src }: UseAvatarFallbackArgs): AvatarFallback {
  const resolved = src && src.trim() !== '' ? src : defaultAvatar;
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);
  const shown = resolved === erroredSrc ? defaultAvatar : resolved;

  return { shown, onError: () => setErroredSrc(resolved) };
}
