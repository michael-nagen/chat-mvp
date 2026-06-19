export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  // Public URL of the current avatar, or null/undefined when none is set.
  avatarUrl?: string | null;
  // Internal S3 object key for the current avatar (never exposed in any DTO);
  // kept so the previous object can be deleted on replace/remove.
  avatarKey?: string | null;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  participantIds: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}
