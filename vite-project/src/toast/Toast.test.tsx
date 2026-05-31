import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toast } from './index';

describe('Toast', () => {
  it('renders nothing when message is null', () => {
    const { container } = render(<Toast message={null} onDismiss={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the message when one is provided', () => {
    render(<Toast message="Failed to send message" onDismiss={vi.fn()} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to send message');
  });
});
