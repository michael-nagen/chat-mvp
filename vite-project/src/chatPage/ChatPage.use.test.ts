import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useChatPage } from './ChatPage.use';
import * as apiClient from '../shared/chatApi/apiClient';

vi.mock('../shared/chatApi/apiClient');

const currentUser = { id: 'u1', name: 'Alice' };

beforeEach(() => {
  vi.mocked(apiClient.getConversations).mockResolvedValue({ conversations: [] });
  vi.mocked(apiClient.getMessages).mockResolvedValue({ messages: [], nextCursor: null });
});

describe('useChatPage optimistic send', () => {
  it('rolls back the message and surfaces an error when sending fails', async () => {
    vi.mocked(apiClient.sendMessage).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useChatPage({ currentUser }));

    // select a conversation and let its (empty) thread load
    act(() => {
      result.current.conversationListProps.onSelectConversation('1');
    });
    await waitFor(() => expect(result.current.messageListProps.isLoading).toBe(false));

    // type a message
    act(() => {
      result.current.composerProps.onChange('hello');
    });

    // send — the mocked API rejects
    await act(async () => {
      await (result.current.composerProps.onSend() as unknown as Promise<void>);
    });

    // optimistic message was removed (rollback)
    expect(result.current.messageListProps.messages).toHaveLength(0);
    // error toast is shown
    expect(result.current.toastProps.message).toBe('Network error');
    // the draft is restored so the user can retry
    expect(result.current.composerProps.value).toBe('hello');
  });
});
