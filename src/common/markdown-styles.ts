import { css } from 'lit';
import { Styles } from './styles';


export class MarkdownStyles extends Styles {

    public static getStyles() {
        return [this.VARIABLES,
        css`
       
        .markdown-body{
            color: var(--textColor);
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
            font-size: 16px;
            line-height: 1.5;
            word-wrap: break-word;
        }

        .markdown-body hr{
            height: 0.25em;
            padding: 0;
            margin: 24px 0;
            background-color: var(--accentGray);
            border: 0;
        }

        .markdown-body blockquote {
            padding: 0 1em;
            color: var(--mutedTextColor);
            border-left: 0.25em solid var(--gray);
            margin: 0;
        }

        .markdown-body code, .markdown-body tt {
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            background-color: var(--color-neutral-muted);
            border-radius: 6px;
        }

        .markdown-body pre code, .markdown-body pre tt {
            display: inline;
            max-width: auto;
            padding: 0;
            margin: 0;
            overflow: visible;
            line-height: inherit;
            word-wrap: normal;
            background-color: transparent;
            border: 0;
        }

        .markdown-body .highlight pre, .markdown-body pre {
            padding: 16px;
            overflow: auto;
            
            line-height: 1.45;
            background-color: var(--color-canvas-subtle);
            border-radius: 6px;
        }

        .markdown-body table {
            display: block;
            width: 100%;
            width: max-content;
            max-width: 100%;
            overflow: auto;
            border-spacing: 0;
            border-collapse: collapse;
        }

        .markdown-body table tr {
            border-top: 1px solid var(--gray);
        }

        .markdown-body table tr:nth-child(2n) {
            background-color: var(--color-canvas-subtle);
        }

        .markdown-body table th, .markdown-body table td {
            padding: 6px 13px;
            border: 1px solid var(--gray);
        }

        .markdown-body h1{
            padding-bottom: 0.3em;
            font-size: 2em;
            border-bottom: 1px solid var(--gray);
        }

        .markdown-body h2{
            padding-bottom: 0.3em;
            font-size: 1.5em;
            border-bottom: 1px solid var(--gray);
        }

        .markdown-body a {
            color: var(--linkAccent);
            text-decoration: none;
        }

        .markdown-body img {
            max-width: 70vw;
            box-sizing: content-box;
            background-color: var(--color-canvas-default);
        }
        `];
    }
}
