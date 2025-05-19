import { Component, input, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MarkdownModule } from "ngx-markdown";
import { Message } from "@/models/message";
import { KatexPipe } from "@/pipes/katex.pipe";

@Component({
  selector: "app-chat-message",
  standalone: true,
  imports: [CommonModule, MarkdownModule, KatexPipe],
  templateUrl: "./chat-message.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ChatMessageComponent {
  message = input.required<Message>();
}
