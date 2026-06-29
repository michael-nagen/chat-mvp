import type { ReactNode } from 'react';
import { modalStyles } from './Modal.styles';

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/** Generic centered modal over a dimmed overlay; clicking the overlay closes it. */
export function Modal({ title, onClose, children }: ModalProps): React.JSX.Element {
  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.card} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            style={modalStyles.close}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
