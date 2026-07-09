import { KnowledgeUploadButton } from './KnowledgeUploadButton';
import { useKnowledgeUploadSlot } from './KnowledgeUploadSlot.use';

// Composer-facing wrapper: shows the tutor upload control only for tutor
// conversations and wires success back into the thread. The composer just drops
// <KnowledgeUploadSlot /> into its layout.
export function KnowledgeUploadSlot(): React.JSX.Element | null {
  const { show, conversationId, onUploaded } = useKnowledgeUploadSlot();
  if (!show || !conversationId) return null;
  return (
    <KnowledgeUploadButton
      conversationId={conversationId}
      onUploaded={onUploaded}
    />
  );
}
