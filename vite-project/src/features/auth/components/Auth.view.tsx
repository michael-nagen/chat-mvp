import type { AuthScreenViewProps } from '../Auth.types';
import { authStyles } from './Auth.styles';
import { AuthHeader } from './AuthHeader';
import { AuthNameField } from './AuthNameField';
import { AuthSubmitButton } from './AuthSubmitButton';

/** Composes the centred login card from the header, name field, error message, and submit button. */
export function AuthScreenView(props: AuthScreenViewProps): React.JSX.Element {
  return (
    <div style={authStyles.overlay}>
      <form onSubmit={props.onSubmit} style={authStyles.card}>

        <AuthHeader />

        <AuthNameField
          name={props.name}
          onNameChange={props.onNameChange}
          isLoading={props.isLoading}
        />

        {props.error && <div style={authStyles.error}>{props.error}</div>}

        <AuthSubmitButton submittable={props.submittable} isLoading={props.isLoading} />

      </form>
    </div>
  );
}
