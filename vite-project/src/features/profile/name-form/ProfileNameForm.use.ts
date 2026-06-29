import { useState } from 'react';
import { useAuth } from '../../auth';
import { useToast } from '../../toast';
import { updateName } from '../model/Profile.api';

/** Owns the first/last name form: local edit state, save action, loading + error. */
export function useProfileNameForm() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submittable =
    firstName.trim().length > 0 && lastName.trim().length > 0 && !isSaving;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!submittable) return;
    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateName({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      updateUser(updated);
      showToast('Name updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update name.');
    } finally {
      setIsSaving(false);
    }
  }

  return {
    firstName,
    lastName,
    onFirstNameChange: setFirstName,
    onLastNameChange: setLastName,
    onSubmit,
    isSaving,
    submittable,
    error,
  };
}
