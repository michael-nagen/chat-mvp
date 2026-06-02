import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConversationListView } from '../components/ConversationList.view';

describe('ConversationListView', () => {
  it('shows the empty state when there are no conversations', () => {
    render(
      <ConversationListView
        conversations={[]}
        isLoading={false}
        error={null}
      />,
    );
    expect(screen.getByText('No conversations yet')).toBeInTheDocument();
  });
});
