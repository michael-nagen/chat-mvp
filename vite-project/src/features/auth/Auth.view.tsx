import type { AuthScreenViewProps } from './Auth.types';
import { useAuthScreenView } from './Auth.use';
import { authStyles } from './Auth.styles';

/** Renders the centred login card with name input, error message, and submit button. */
export function AuthScreenView(props: AuthScreenViewProps): React.JSX.Element {
  const { submittable, handleSubmit } = useAuthScreenView(props);

  return (
    <div style={authStyles.overlay}>
      <form onSubmit={handleSubmit} style={authStyles.card}>

        <h2 style={authStyles.title}>Log in</h2>
        <p style={authStyles.hint}>Enter your name to continue (try Alice or Bob).</p>

        <input
          type="text"
          value={props.name}
          onChange={(e) => props.onNameChange(e.target.value)}
          placeholder="Your name"
          autoFocus
          disabled={props.isLoading}
          style={authStyles.input}
        />

        {props.error && <div style={authStyles.error}>{props.error}</div>}

        <button type="submit" disabled={!submittable} style={authStyles.button(submittable)}>
          {props.isLoading ? 'Logging in...' : 'Log in'}
        </button>

      </form>
    </div>
  );
}
