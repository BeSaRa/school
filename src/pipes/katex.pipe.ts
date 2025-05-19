import { Pipe, PipeTransform } from '@angular/core';
import katex from 'katex';

@Pipe({
  name: 'katex',
  standalone: true
})
export class KatexPipe implements PipeTransform {
  transform(content: string): string {
    if (!content) return '';
    
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