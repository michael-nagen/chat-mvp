import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { KnowledgeUploadButton } from '../KnowledgeUploadButton';
import { ToastProvider } from '../../toast';
import { uploadKnowledgeDocument } from '../model/KnowledgeUpload.api';

// Mock only the network layer; validation + wiring are exercised for real.
vi.mock('../model/KnowledgeUpload.api', () => ({
  uploadKnowledgeDocument: vi.fn(),
}));

const uploadMock = vi.mocked(uploadKnowledgeDocument);

function renderButton() {
  const utils = render(
    <ToastProvider>
      <KnowledgeUploadButton conversationId="c-tutor" />
    </ToastProvider>,
  );
  const input = utils.container.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  return { ...utils, input };
}

const selectFile = (input: HTMLInputElement, file: File): void => {
  fireEvent.change(input, { target: { files: [file] } });
};

describe('KnowledgeUploadButton', () => {
  beforeEach(() => {
    uploadMock.mockReset();
  });

  it('renders the upload button', () => {
    renderButton();
    expect(screen.getByRole('button', { name: 'Upload file' })).toBeInTheDocument();
  });

  it('does not call the API for an invalid file type', async () => {
    const { input } = renderButton();
    selectFile(input, new File(['x'], 'doc.pdf', { type: 'application/pdf' }));

    // Validation blocks the upload before any network call.
    await Promise.resolve();
    expect(uploadMock).not.toHaveBeenCalled();
  });

  it('uploads a valid .txt file', async () => {
    uploadMock.mockResolvedValue({
      document: {
        id: 'kd-1',
        fileName: 'notes.txt',
        status: 'ready',
        chunkCount: 2,
        createdAt: '2026-07-01T00:00:00.000Z',
      },
      alreadyExisted: false,
    });

    const { input } = renderButton();
    selectFile(input, new File(['hello'], 'notes.txt', { type: 'text/plain' }));

    await waitFor(() => expect(uploadMock).toHaveBeenCalledTimes(1));
    expect(uploadMock.mock.calls[0][0]).toEqual({
      file: expect.any(File),
      conversationId: 'c-tutor',
    });
  });
});
