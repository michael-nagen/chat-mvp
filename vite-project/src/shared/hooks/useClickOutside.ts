import { useEffect } from 'react';

type UseClickOutsideArgs<T extends HTMLElement> = {
  ref: React.RefObject<T | null>;
  onOutside: () => void;
  enabled: boolean;
};

// Dismisses on a pointer press outside `ref` or on Escape; inert while `enabled` is false.
export function useClickOutside<T extends HTMLElement>({
  ref,
  onOutside,
  enabled,
}: UseClickOutsideArgs<T>): void {
  useEffect(() => {
    if (!enabled) return;

    function handlePointer(event: MouseEvent): void {
      const node = ref.current;
      if (node && !node.contains(event.target as Node)) onOutside();
    }

    function handleKey(event: KeyboardEvent): void {
      if (event.key === 'Escape') onOutside();
    }

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [ref, onOutside, enabled]);
}
