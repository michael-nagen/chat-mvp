export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  // Computed convenience field (firstName + lastName); firstName/lastName are the source of truth.
  displayName: string;
  // Public avatar URL, or null when the user has no avatar. avatarKey is never exposed.
  avatarUrl: string | null;
}

// Public, minimal view of another user (e.g. a conversation participant or a
// message sender). Never includes email or any internal field.
export interface UserSummary {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

// Mutable profile fields a repository may patch. passwordHash and id are not editable here.
export interface UserUpdate {
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
  avatarKey?: string | null;
}
