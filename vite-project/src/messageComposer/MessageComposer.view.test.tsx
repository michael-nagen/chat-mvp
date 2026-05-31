import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageComposerView } from './MessageComposer.view';

describe('MessageComposerView', () => {
  it('disables Send when the input is empty', () => {
    render(
      <MessageComposerView value="" onChange={vi.fn()} onSend={vi.fn()} isSending={false} />,
    );
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });
});
