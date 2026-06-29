export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  // Computed by the backend (firstName + lastName).
  displayName: string;
  // Public avatar URL, or null when the user has no avatar set.
  avatarUrl: string | null;
};

// Public, minimal view of another user (e.g. a conversation participant or a
// message sender). Mirrors the backend's UserSummary — no email/internal fields.
export type UserSummary = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
};
