import { css, LitElement } from 'lit';
var hljs = require('highlight.js/lib/common');

// @customElement('category-badge')
export class Highlighter extends LitElement {


    public static findAndHighlightCode(page: string) {
        var isLanguageCodeFound: boolean = false;
        var coursorIndex: number = 0;
        var codeSyntaxIndex: number = 0;
        var start: number = 0;
        var end: number = 0;

        codeSyntaxIndex = page.indexOf(`<code class="language`, coursorIndex);
        if (codeSyntaxIndex == -1) return page;

        do {
            console.log(codeSyntaxIndex);

            start = page.indexOf(`>`, codeSyntaxIndex);
            end = page.indexOf(`</code>`, start);

            let code = page.substring(start + 1, end);
            let highlightedCode = hljs.highlightAuto(code).value;
            page = this.replaceBetween(page, start + 1, end, highlightedCode);

            //check if there is next language code
            coursorIndex = end + 1;
            codeSyntaxIndex = page.indexOf(`<code class="language`, coursorIndex);

            codeSyntaxIndex != -1 ? isLanguageCodeFound = true : isLanguageCodeFound = false;
        }
        while (isLanguageCodeFound);

        return page;
    }

    private static replaceBetween(origin, start, end, replacement): string {
        return origin.substring(0, start) + replacement + origin.substring(end);
    }

    public static getStyles() {
        return css`
        :host{
            --textColor: #d4dae0;
            --mutedTextColor: #8b949e;
            --gray: #313233;
            --linkAccent: #58a6ff;
            --color-neutral-muted: rgba(110,118,129,0.4);
            --color-canvas-subtle: rgba(55, 55, 55, 0.4);
            --key-word-color: #ff7b72;
            --number-color: #79c0ff;
            --function-color: #d2a8ff;
        }
        
        pre code .hljs{
            display:block;
            overflow-x:auto;
            padding:1em
        }
        code .hljs{
            padding:3px 5px
        }.hljs
        {background:#f3f3f3;
            color:#444
        }
        .hljs-comment{
            color:#697070
        }
        .hljs-punctuation,.hljs-tag{
            color:#444a
        }
        .hljs-tag .hljs-attr,.hljs-tag .hljs-name{
            color:#444
        }
        .hljs-attribute,.hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-name,.hljs-selector-tag{
            font-weight:700;
            color: var(--key-word-color);
        }
        .hljs-deletion,.hljs-number,.hljs-quote,.hljs-selector-class,.hljs-selector-id,.hljs-string,.hljs-template-tag,.hljs-type{
            color: var(--number-color);
        }
        .hljs-section,.hljs-title{
            color: var(--function-color);
            font-weight:700
        }
        .hljs-link,.hljs-operator,.hljs-regexp,.hljs-selector-attr,.hljs-selector-pseudo,.hljs-symbol,.hljs-template-variable,.hljs-variable{
            color:#ab5656
        }
        .hljs-literal{
            color:#695
        }
        .hljs-addition,.hljs-built_in,.hljs-bullet,.hljs-code{
            color:#397300
        }.hljs-meta{
            color:#1f7199
        }
        .hljs-meta .hljs-string{
            color:#38a
        }
        .hljs-emphasis{
            font-style:italic
        }
        .hljs-strong{
            font-weight:700
        }
        `
    }
}
