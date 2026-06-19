import { chatPageStyles } from '../ChatPage.styles';
import { useAuth } from '../../../auth';

export function LogoutButton(): React.JSX.Element {
  const { logout } = useAuth();

  return (
    <button type="button" onClick={logout} style={chatPageStyles.logoutButton}>
      Log out
    </button>
  );
}
