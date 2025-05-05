import { Component, Input } from "@angular/core";
import { Message } from "@/models/message";
import { CommonModule } from "@angular/common";
import { MarkdownModule } from "ngx-markdown";

@Component({
  selector: "app-chat-message",
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: "./chat-message.component.html",
})
export class ChatMessageComponent {
  @Input() message!: Message;
}
