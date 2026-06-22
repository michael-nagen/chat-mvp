import { Link } from 'react-router-dom';
import { profilePageStyles } from './ProfilePage.styles';
import { profileStrings } from './profile.strings';

export function ProfileHeader(): React.JSX.Element {
  return (
    <div style={profilePageStyles.header}>
      <h1 style={profilePageStyles.title}>{profileStrings.title}</h1>
      <Link to="/chat" style={profilePageStyles.backLink}>
        ← Back to chat
      </Link>
    </div>
  );
}
