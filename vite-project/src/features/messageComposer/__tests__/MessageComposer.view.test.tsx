import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageComposerView } from '../components/MessageComposer.view';

describe('MessageComposerView', () => {
  it('disables Send when the input is empty', () => {
    render(
      <MessageComposerView
        value=""
        onChange={vi.fn()}
        isSending={false}
        sendable={false}
        handleSubmit={vi.fn()}
        handleKeyDown={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });
});
