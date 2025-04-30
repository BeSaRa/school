import { Component, Input } from "@angular/core";
import { Message } from "@/models/message";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-chat-message",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./chat-message.component.html",
})
export class ChatMessageComponent {
  @Input() message!: Message;
}
