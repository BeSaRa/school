import { Component, Input, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MarkdownModule } from "ngx-markdown";
import { Message } from "@/models/message";
import katex from "katex";

@Component({
  selector: "app-chat-message",
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: "./chat-message.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ChatMessageComponent {
  @Input() message!: Message;

  renderKaTeX(content: string): string {
    const inlineRegex = /\$([^$]+)\$/g;
    const blockRegex = /\$\$([^$]+)\$\$/g;

    let html = content.replace(blockRegex, (_, expr) =>
      katex.renderToString(expr, {
        displayMode: true,
        output: "htmlAndMathml",
      })
    );

    html = html.replace(inlineRegex, (_, expr) =>
      katex.renderToString(expr, {
        displayMode: true,
        output: "htmlAndMathml",
      })
    );

    return html;
  }
}
