import type { AuthScreenViewProps } from './Auth.types';
import { useAuthScreenView } from './Auth.use';

/** Renders the centred login card with name input, error message, and submit button. */
export function AuthScreenView(props: AuthScreenViewProps) {
  const { submittable, handleSubmit } = useAuthScreenView(props);

  return (
    <div style={styles.overlay}>
      <form onSubmit={handleSubmit} style={styles.card}>

        <h2 style={styles.title}>Log in</h2>
        <p style={styles.hint}>Enter your name to continue (try Alice or Bob).</p>

        <input
          type="text"
          value={props.name}
          onChange={(e) => props.onNameChange(e.target.value)}
          placeholder="Your name"
          autoFocus
          disabled={props.isLoading}
          style={styles.input}
        />

        {props.error && <div style={styles.error}>{props.error}</div>}

        <button type="submit" disabled={!submittable} style={styles.button(submittable)}>
          {props.isLoading ? 'Logging in...' : 'Log in'}
        </button>

      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.35)',
    fontFamily: 'sans-serif',
  },
  card: {
    width: '320px',
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
  },
  hint: {
    margin: 0,
    fontSize: '13px',
    color: '#888',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  error: {
    color: 'red',
    fontSize: '13px',
  },
  button: (submittable: boolean): React.CSSProperties => ({
    padding: '10px 14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: submittable ? '#0084ff' : '#ccc',
    color: 'white',
    cursor: submittable ? 'pointer' : 'default',
  }),
};
