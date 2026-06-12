import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecentSearches } from '../components/RecentSearches';
import { SearchResultRow } from '../components/SearchResultRow';
import type { Message } from '../../../shared/entities/Message.types';

const noop = (): void => {};

describe('messageSearch components', () => {
  it('renders recent searches', () => {
    render(<RecentSearches searches={['hello', 'deploy']} onSelect={noop} />);
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('deploy')).toBeInTheDocument();
  });

  it('renders a result with the conversation title above the message content', () => {
    const message: Message = {
      id: 'm1',
      conversationId: 'c1',
      content: 'Hey Bob!',
      sender: 'user',
      timestamp: '2026-06-04T08:00:00.000Z',
    };
    render(<SearchResultRow conversationTitle="Alice & Bob" message={message} onSelect={noop} />);
    expect(screen.getByText('Alice & Bob')).toBeInTheDocument();
    expect(screen.getByText('Hey Bob!')).toBeInTheDocument();
  });
});
