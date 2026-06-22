import type { useProfileNameForm } from './ProfileNameForm.use';

/** Shared name-form state exposed via ProfileNameFormContext and read by each child. */
export type ProfileNameFormValue = ReturnType<typeof useProfileNameForm>;
