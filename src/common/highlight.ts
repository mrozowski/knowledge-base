import { css } from 'lit';

export class Highlighter {

    public static getStyles() {
        return css`
        :host{
            --standard-text-color: #a9b7c6;
            --comment-color: #697070;
            --accent-comment-color: #788383;
            --color-neutral-muted: rgba(110,118,129,0.4);
            --color-canvas-subtle: rgba(55, 55, 55, 0.4);
            --keyword-color: #cc7832;
            --number-color: #79c0ff;
            --function-color: #ffc66d;
            --string-color: #629755;
            --variable-name-color: #a9b7c6;
            --operator-color: #a9b7c6;
            --meta-color: #bbb529;

            --media-rule-color: #C586C0;
            --attribute-color: #36A3F0;
            --selector-color: #D7BA5E;
        }
        /* Default style */
        pre code .hljs{
            display:block;
            overflow-x:auto;
            padding:1em
        }
        code .hljs{
            padding:3px 5px
        }
        .hljs{
            background:#f3f3f3;
            color: var(--standard-text-color);
        }
        .hljs-doctag{
            color: var(--accent-comment-color);
            font-weight: bold;
        }
        .hljs-comment{
            color: var(--comment-color);
        }
        .hljs-punctuation,.hljs-tag{
            color:#444a
        }
        .hljs-tag .hljs-attr,.hljs-tag .hljs-name{
            color:#444
        }
        .hljs-attribute,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-name,.hljs-selector-tag{
            font-weight:700;
            color: var(--keyword-color);
        }
        .hljs-deletion,.hljs-number,.hljs-selector-class,.hljs-selector-id,.hljs-template-tag{
            color: var(--number-color);
        }
        .hljs-type, .hljs-built_in, .hljs-literal{
            color: var(--keyword-color);
        }
        .hljs-variable{
            color: var(--variable-name-color);
        }
        .hljs-title{
            color: var(--standard-text-color);
        }
        .function_{
            color: var(--function-color);
        }
        .hljs-quote{

        }
        .hljs-meta{
            color: var(--meta-color);
        }
        .hljs-operator{
            color: var(--operator-color);
        }
        .hljs-string{
            color: var(--string-color);
        }
        .hljs-section{
            color: var(--function-color);
            font-weight:700
        }
        .hljs-link,.hljs-regexp,.hljs-selector-attr,.hljs-selector-pseudo,.hljs-symbol,.hljs-template-variable{
            color:#ab5656;
        }
        .hljs-addition,.hljs-bullet,.hljs-code{
            color:#397300
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
        /* CSS style */
        .language-css .hljs-keyword{
            color: var(--media-rule-color);
        }
        .language-css .hljs-attribute,.language-css .hljs-attr{
            color: var(--attribute-color);
        }
        .language-css .hljs-selector-tag, .language-css .hljs-selector-class{
            font-weight: bold;
            color: var(--selector-color);
        }
        /* HTML style */
        .language-html .hljs-name, .language-html .hljs-meta{
            color: var(--attribute-color);
        }
        .language-html .hljs-attr, .language-html .hljs-keyword{
            color: var(--number-color);
        }
        .language-html .hljs-tag{
            color: var(--standard-text-color);
        }
        .language-html .hljs-string{
            color: var(--function-color);
        }
        `
    }
}
