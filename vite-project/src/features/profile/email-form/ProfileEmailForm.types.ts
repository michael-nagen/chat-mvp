/** Shared email-form state exposed via ProfileEmailFormContext and read by each child. */
export type ProfileEmailFormValue = {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
  submittable: boolean;
  error: string | null;
};
