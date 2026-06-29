import { useState } from 'react';
import { useAuth } from '../../auth';
import { useToast } from '../../toast';
import { updateEmail } from '../model/Profile.api';

/** Owns the email form: local edit state, save action, loading + error. */
export function useProfileEmailForm() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState(user?.email ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submittable = email.trim().length > 0 && !isSaving;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!submittable) return;
    setIsSaving(true);
    setError(null);
    try {
      const updated = await updateEmail({ email: email.trim() });
      updateUser(updated);
      showToast('Email updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update email.');
    } finally {
      setIsSaving(false);
    }
  }

  return {
    email,
    onEmailChange: setEmail,
    onSubmit,
    isSaving,
    submittable,
    error,
  };
}
