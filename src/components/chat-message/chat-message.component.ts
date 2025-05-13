import { Component, inject, Input } from "@angular/core";
import { Message } from "@/models/message";
import { CommonModule } from "@angular/common";
import { MarkdownModule, MARKED_OPTIONS } from "ngx-markdown";
import { MarkdownService } from "../../services/markdown.service";

@Component({
  selector: "app-chat-message",
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: "./chat-message.component.html",
  // providers: [
  //   {
  //     provide: MARKED_OPTIONS,
  //     useFactory: (markdownService: MarkdownService) =>
  //       markdownService.getMarkedOptions(),
  //     deps: [MarkdownService],
  //   },
  // ],
})
export class ChatMessageComponent {
  @Input() message!: Message;
  markdownService = inject(MarkdownService);
}
