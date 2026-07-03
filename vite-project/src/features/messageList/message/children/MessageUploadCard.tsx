import { messageStyles } from '../Message.styles';
import { useMessage } from '../Message.context';

// Renders a tutor "knowledge upload" event as a small card instead of a plain
// bubble. Reads document info from the message metadata; no file content is here.
export function MessageUploadCard(): React.JSX.Element {
  const { message } = useMessage();
  const { documentName, status } = message.metadata ?? {};
  const failed = status === 'failed';

  return (
    <div style={messageStyles.uploadCard}>
      <span style={messageStyles.uploadCardTitle}>
        {failed ? 'Upload failed' : 'Knowledge uploaded'}
      </span>
      <span style={messageStyles.uploadCardName}>
        {documentName ?? message.content}
      </span>
      {!failed ? (
        <span style={messageStyles.uploadCardHint}>Ready for tutor questions</span>
      ) : null}
    </div>
  );
}
