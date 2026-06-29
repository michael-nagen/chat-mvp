import { messageStyles } from '../Message.styles';
import { formatClockTime } from '../../../../shared/utils/formatClockTime';
import { useMessage } from '../Message.context';

export function MessageTime(): React.JSX.Element {
  const { message } = useMessage();

  return <span style={messageStyles.time}>{formatClockTime(message.timestamp)}</span>;
}
