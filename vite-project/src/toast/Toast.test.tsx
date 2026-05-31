import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ChatProvider } from '../chatPage/ChatContext';
import { Toast } from './index';

describe('Toast', () => {
  it('renders nothing when there is no send error', () => {
    const { container } = render(
      <ChatProvider>
        <Toast />
      </ChatProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
