export type MessageRole =
  | "system"
  | "user"
  | "assistant"
  | "tool"
  | "developer";

export class Message {
  constructor(
    public content: string,
    public role: MessageRole
  ) {}
}
