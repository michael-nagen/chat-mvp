import { useChatSelection } from '../chatPage/ChatSelection.context';
import { useMessageThread } from '../messageThread';
import type {
  KnowledgeDocumentResponse,
  KnowledgeUploadSlotState,
} from './KnowledgeUpload.types';

// Owns the tutor knowledge-upload behavior end to end: gates the control to
// tutor conversations and, on success, appends the optimistic "knowledge
// uploaded" event to the thread. The composer renders the slot and knows none
// of this.
export function useKnowledgeUploadSlot(): KnowledgeUploadSlotState {
  const { selectedConversationId, selectedConversation } = useChatSelection();
  const { addOptimisticMessage } = useMessageThread();

  // Show the persisted upload event instantly (it is also persisted server-side
  // and will reload from there on the next fetch). senderId matches the backend
  // tutor assistant so it renders on the assistant side.
  function onUploaded(document: KnowledgeDocumentResponse): void {
    if (!selectedConversationId) return;
    addOptimisticMessage({
      id: `upload-${document.id}-${Date.now()}`,
      conversationId: selectedConversationId,
      content: `Uploaded knowledge file: ${document.fileName}`,
      sender: 'assistant',
      senderId: 'tutor-assistant',
      timestamp: new Date().toISOString(),
      metadata: {
        kind: 'knowledge_upload',
        documentId: document.id,
        documentName: document.fileName,
        status: 'completed',
      },
    });
  }

  return {
    show: selectedConversation?.type === 'tutor',
    conversationId: selectedConversationId,
    onUploaded,
  };
}
