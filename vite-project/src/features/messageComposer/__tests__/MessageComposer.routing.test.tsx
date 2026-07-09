import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

const { streamReply, showToast, selection } = vi.hoisted(() => ({
  streamReply: vi.fn().mockResolvedValue(undefined),
  showToast: vi.fn(),
  selection: {
    current: {
      selectedConversationId: 'c-1',
      selectedConversation: {
        id: 'c-1',
        type: 'assistant',
        participants: [{ id: 'u-1' }, { id: 'assistant-1' }],
      },
    },
  },
}));

vi.mock('../../chatPage/ChatSelection.context', () => ({
  useChatSelection: () => selection.current,
}));
vi.mock('../../messageThread', () => ({
  useMessageThread: () => ({
    addOptimisticMessage: vi.fn(),
    confirmMessage: vi.fn(),
    rollbackMessage: vi.fn(),
  }),
}));
vi.mock('../../assistantReply', () => ({ useAiReply: () => ({ streamReply }) }));
vi.mock('../../auth', () => ({ useAuth: () => ({ user: { id: 'u-1' } }) }));
vi.mock('../../toast', () => ({ useToast: () => ({ showToast }) }));
vi.mock('../model/MessageComposer.utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../model/MessageComposer.utils')>();
  return { ...actual, sendOptimisticMessage: vi.fn().mockResolvedValue({ ok: true }) };
});

import { useMessageComposer } from '../MessageComposer.use';

async function send(type: string): Promise<void> {
  selection.current = {
    selectedConversationId: 'c-1',
    selectedConversation: {
      id: 'c-1',
      type,
      participants: [{ id: 'u-1' }, { id: 'ai-1' }],
    },
  };
  const { result } = renderHook(() => useMessageComposer());
  act(() => result.current.onChange('hello'));
  await act(async () => {
    result.current.handleSubmit({ preventDefault: vi.fn() } as never);
  });
}

beforeEach(() => {
  streamReply.mockClear();
  showToast.mockClear();
});

describe('useMessageComposer AI-reply routing', () => {
  it('streams the AI reply for an assistant conversation', async () => {
    await send('assistant');
    await waitFor(() =>
      expect(streamReply).toHaveBeenCalledWith({ conversationId: 'c-1', aiSenderId: 'ai-1' }),
    );
  });

  it('streams the AI reply for a tutor conversation', async () => {
    await send('tutor');
    await waitFor(() =>
      expect(streamReply).toHaveBeenCalledWith({ conversationId: 'c-1', aiSenderId: 'ai-1' }),
    );
  });

  it('does not stream for a dm conversation', async () => {
    await send('dm');
    await new Promise((r) => setTimeout(r, 0));
    expect(streamReply).not.toHaveBeenCalled();
  });

  it('does not stream for a group conversation', async () => {
    await send('group');
    await new Promise((r) => setTimeout(r, 0));
    expect(streamReply).not.toHaveBeenCalled();
  });
});
