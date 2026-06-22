import { authStyles } from './Auth.styles';
import { authStrings } from '../auth.strings';
import { useAuthScreenContext } from '../AuthScreen.context';

/** Title and hint shown at the top of the auth card, reflecting the active mode. */
export function AuthHeader(): React.JSX.Element {
  const { mode } = useAuthScreenContext();
  return (
    <>
      <h2 style={authStyles.title}>{authStrings.title[mode]}</h2>
      <p style={authStyles.hint}>{authStrings.hint[mode]}</p>
    </>
  );
}
