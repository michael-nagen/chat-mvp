import { authStyles } from './Auth.styles';

/** Title and hint shown at the top of the login card. */
export function AuthHeader(): React.JSX.Element {
  return (
    <>
      <h2 style={authStyles.title}>Log in</h2>
      <p style={authStyles.hint}>Enter your name to continue (try Alice or Bob).</p>
    </>
  );
}
