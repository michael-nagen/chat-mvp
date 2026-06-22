/** User-facing copy for the auth screen, keyed by mode where it varies. */
export const authStrings = {
  title: { login: 'Log in', signup: 'Create account' },
  hint: {
    login:
      'Sign in with your email and password (try alice@example.com / password).',
    signup: 'Register with your email and a password of at least 6 characters.',
  },
  submit: {
    idle: { login: 'Log in', signup: 'Create account' },
    busy: { login: 'Logging in...', signup: 'Creating account...' },
  },
  toggle: {
    login: "Don't have an account? Sign up",
    signup: 'Already have an account? Log in',
  },
  fields: {
    email: 'Email',
    firstName: 'First name',
    lastName: 'Last name',
    password: 'Password',
  },
} as const;
