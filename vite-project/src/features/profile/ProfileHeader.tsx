import { Link } from 'react-router-dom';
import { profileStyles } from './shared/Profile.styles';

export function ProfileHeader(): React.JSX.Element {
  return (
    <div style={profileStyles.header}>
      <h1 style={profileStyles.title}>Profile</h1>
      <Link to="/chat" style={profileStyles.backLink}>
        ← Back to chat
      </Link>
    </div>
  );
}
