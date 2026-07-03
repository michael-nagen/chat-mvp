import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageComposerView } from '../components/MessageComposer.view';
import { ChatSelectionProvider } from '../../chatPage/ChatSelectionProvider';
import { MessageThreadProvider } from '../../messageThread';

describe('MessageComposerView', () => {
  it('disables Send when the input is empty', () => {
    // The view composes <KnowledgeUploadSlot />, which reads chat-selection and
    // message-thread context; both providers are side-effect-free.
    render(
      <ChatSelectionProvider>
        <MessageThreadProvider>
          <MessageComposerView
            value=""
            onChange={vi.fn()}
            isSending={false}
            sendable={false}
            handleSubmit={vi.fn()}
            handleKeyDown={vi.fn()}
          />
        </MessageThreadProvider>
      </ChatSelectionProvider>,
    );
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });
});
