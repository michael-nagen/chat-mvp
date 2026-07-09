import { useRef, useState } from 'react';
import { useToast } from '../toast';
import { knowledgeUploadStyles } from './KnowledgeUpload.styles';
import {
  KNOWLEDGE_FILE_ACCEPT,
  validateKnowledgeFile,
} from './model/knowledgeFileValidation';
import { uploadKnowledgeDocument } from './model/KnowledgeUpload.api';
import type { KnowledgeUploadButtonProps } from './KnowledgeUpload.types';

// Tutor-only "Upload file" control: opens the native picker, validates the file
// on the client (UX only — the backend re-validates), uploads via multipart, and
// surfaces loading/success/error through the shared toast. Rendered by the
// composer only for tutor conversations.
export function KnowledgeUploadButton({
  conversationId,
  onUploaded,
}: KnowledgeUploadButtonProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  async function onFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = event.target.files?.[0];
    // Reset so selecting the same file again still fires onChange.
    event.target.value = '';
    if (!file) return;

    const result = validateKnowledgeFile(file);
    if (!result.ok) {
      showToast(result.message);
      return;
    }

    setIsUploading(true);
    try {
      const { document, alreadyExisted } = await uploadKnowledgeDocument({
        file,
        conversationId,
      });
      showToast(
        alreadyExisted
          ? `"${document.fileName}" was already in your knowledge base.`
          : `Uploaded "${document.fileName}".`,
      );
      onUploaded?.(document);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Upload failed. Please try again.',
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        style={knowledgeUploadStyles.button(isUploading)}
      >
        {isUploading ? 'Uploading…' : 'Upload file'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={KNOWLEDGE_FILE_ACCEPT}
        onChange={(event) => void onFileChange(event)}
        style={knowledgeUploadStyles.hiddenInput}
      />
    </>
  );
}
