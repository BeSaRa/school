import { Component, inject, input, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MarkdownModule } from "ngx-markdown";
import { Message } from "@/models/message";
import katex from "katex";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-chat-message",
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: "./chat-message.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ChatMessageComponent {
  domSanitizer = inject(DomSanitizer);
  message = input.required<Message>();
  
  renderKaTeX(content: string): string {
    const inlineRegex = /\$(?!\$)([^$]+?)\$/g;
    const blockRegex = /\$\$([^$]+)\$\$/g;

    let html = content.replace(blockRegex, (_, expr) =>
      katex.renderToString(expr, {
        throwOnError: false,
      })
    );

    html = html.replace(inlineRegex, (_, expr) =>
      katex.renderToString(expr, {
        throwOnError: false,
      })
    );

    return html;
  }
}
