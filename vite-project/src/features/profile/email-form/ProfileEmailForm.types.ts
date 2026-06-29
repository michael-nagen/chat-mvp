import type { useProfileEmailForm } from './ProfileEmailForm.use';

/** Shared email-form state exposed via ProfileEmailFormContext and read by each child. */
export type ProfileEmailFormValue = ReturnType<typeof useProfileEmailForm>;
