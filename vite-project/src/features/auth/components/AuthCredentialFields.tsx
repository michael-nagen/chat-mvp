import { authStyles } from './Auth.styles';
import { useAuthScreenContext } from '../AuthScreen.context';

/** Controlled email + password inputs shared by the login and signup modes. */
export function AuthCredentialFields(): React.JSX.Element {
  const { mode, email, onEmailChange, name, onNameChange, password, onPasswordChange, isLoading } =
    useAuthScreenContext();
  return (
    <>
      <input
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        placeholder="Email"
        autoComplete="email"
        autoFocus
        disabled={isLoading}
        style={authStyles.input}
      />
      {mode === 'signup' && (
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Name"
          autoComplete="name"
          disabled={isLoading}
          style={authStyles.input}
        />
      )}
      <input
        type="password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        placeholder="Password"
        autoComplete="current-password"
        disabled={isLoading}
        style={authStyles.input}
      />
    </>
  );
}
