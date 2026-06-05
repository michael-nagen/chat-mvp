export type Conversation = {
  id: string;
  title: string;
  lastMessage: string; // preview of the most recent message
  updatedAt: string; // ISO 8601 timestamp, used for sorting
  participantIds: string[]; // user ids that belong to this conversation
};
