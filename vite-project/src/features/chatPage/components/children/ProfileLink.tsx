import { Link } from 'react-router-dom';
import { chatPageStyles } from '../ChatPage.styles';
import { useAuth } from '../../../auth';
import { Avatar } from '../../../../shared/components/Avatar';

export function ProfileLink(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <Link to="/profile" style={chatPageStyles.profileLink} title="View profile">
      <Avatar src={user?.avatarUrl ?? null} name={user?.displayName ?? ''} size={28} />
      <span style={chatPageStyles.profileLinkText}>{user?.email}</span>
    </Link>
  );
}
