/** Shared name-form state exposed via ProfileNameFormContext and read by each child. */
export type ProfileNameFormValue = {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSaving: boolean;
  submittable: boolean;
  error: string | null;
};
