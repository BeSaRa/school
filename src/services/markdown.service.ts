import { Injectable } from "@angular/core";
import * as katex from "katex";
import { MarkedOptions, Tokenizer, Tokens } from "marked";

class KaTeXTokenizer extends Tokenizer {
  override paragraph(src: string): Tokens.Paragraph | undefined {
    const match = /^\$\$([^$]+)\$\$/.exec(src);
    if (match) {
      try {
        const html = katex.renderToString(match[1], { displayMode: true });
        return {
          type: "paragraph",
          raw: match[0],
          text: html,
          tokens: [],
        };
      } catch (err) {
        console.error("KaTeX block error:", err);
      }
    }
    return super.paragraph(src);
  }

  override codespan(src: string): Tokens.Codespan | undefined {
    const match = /^\$([^\$]+)\$/.exec(src);
    if (match) {
      try {
        const html = katex.renderToString(match[1], { displayMode: false });
        return {
          type: "codespan",
          raw: match[0],
          text: html,
        };
      } catch (err) {
        console.error("KaTeX inline error:", err);
      }
    }
    return super.codespan(src);
  }
}

@Injectable({ providedIn: "root" })
export class MarkdownService {
  getMarkedOptions(): MarkedOptions {
    console.log("getMarkedOptions");

    return {
      gfm: true,
      breaks: false,
      tokenizer: new KaTeXTokenizer(),
    };
  }
}
