import { useState } from 'react';
import type { ReactNode } from 'react';
import { ToastContext } from './Toast.context';

export function ToastProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [message, setMessage] = useState<string | null>(null);

  function showToast(nextMessage: string): void {
    setMessage(nextMessage);
  }

  function dismissToast(): void {
    setMessage(null);
  }

  return (
    <ToastContext.Provider value={{ message, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}
