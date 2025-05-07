export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

export interface ConversationGroup {
  title: string;
  conversations: Conversation[];
}

export interface ConversationsResponse {
  conversations: Conversation[];
  count: number;
}
