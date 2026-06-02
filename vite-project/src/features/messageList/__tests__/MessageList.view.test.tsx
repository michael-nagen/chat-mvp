import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageListView } from '../components/MessageList.view';

describe('MessageListView', () => {
  it('prompts to select a conversation when none is selected', () => {
    render(
      <MessageListView
        messages={[]}
        isLoading={false}
        error={null}
        hasSelectedConversation={false}
      />,
    );
    expect(screen.getByText('Select a conversation to start')).toBeInTheDocument();
  });
});
