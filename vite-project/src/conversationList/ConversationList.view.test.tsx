import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConversationListView } from './ConversationList.view';

describe('ConversationListView', () => {
  it('shows the empty state when there are no conversations', () => {
    render(
      <ConversationListView
        rows={[]}
        isLoading={false}
        error={null}
        onSelectConversation={vi.fn()}
      />,
    );
    expect(screen.getByText('No conversations yet')).toBeInTheDocument();
  });
});
