export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  // Ids of users this user may start conversations with. Enforced server-side
  // on conversation creation; empty for a brand-new user.
  contactIds: string[];
  // Public URL of the current avatar, or null/undefined when none is set.
  avatarUrl?: string | null;
  // Internal S3 object key for the current avatar (never exposed in any DTO);
  // kept so the previous object can be deleted on replace/remove.
  avatarKey?: string | null;
}
