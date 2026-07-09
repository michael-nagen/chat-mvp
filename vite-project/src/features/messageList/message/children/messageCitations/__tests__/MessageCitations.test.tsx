import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageCitations } from '../MessageCitations';
import { MessageContext } from '../../../Message.context';
import type { Message } from '../../../../../../shared/entities/Message.types';

const base: Message = {
  id: 'm1',
  conversationId: 'c1',
  content: 'Relevant information was not found.',
  sender: 'assistant',
  senderId: 'tutor-assistant',
  timestamp: '2026-07-01T00:00:00.000Z',
};

const renderWith = (message: Message) =>
  render(
    <MessageContext.Provider value={{ message }}>
      <MessageCitations />
    </MessageContext.Provider>,
  );

describe('MessageCitations', () => {
  it('renders nothing for a fallback answer with no metadata', () => {
    const { container } = renderWith(base);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText('Sources')).toBeNull();
  });

  it('renders nothing when citations is an empty array', () => {
    const { container } = renderWith({ ...base, metadata: { citations: [] } });
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for the user's own message even if citations exist", () => {
    const { container } = renderWith({
      ...base,
      sender: 'user',
      metadata: {
        citations: [
          { chunkId: 'kc-1', documentId: 'd1', documentName: 'doc.md', chunkIndex: 0, score: 0.8 },
        ],
      },
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('renders Sources when there are citations', () => {
    renderWith({
      ...base,
      metadata: {
        citations: [
          { chunkId: 'kc-1', documentId: 'd1', documentName: 'doc.md', chunkIndex: 0, score: 0.82 },
        ],
      },
    });
    expect(screen.getByText('Sources')).toBeInTheDocument();
    expect(screen.getByText(/doc\.md/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show source' })).toBeInTheDocument();
  });
});
