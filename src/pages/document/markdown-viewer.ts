import { html, LitElement, PropertyDeclaration } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { MarkdownStyles } from '../../common/markdown-styles';
import { Highlighter } from '../../common/highlight';

var markdownIt = require('markdown-it');
var emoji = require('markdown-it-emoji');
var subscript = require('markdown-it-sub');
var superscript = require('markdown-it-sup');

@customElement('markdown-viewer')
export class MarkdownViewer extends LitElement {

    private md: any;
    private start: number = new Date().getTime();
    constructor() {
        super();
        this.md = new markdownIt({ typographer: true, linkify: true, html: true });
        this.md.use(emoji);
        this.md.use(subscript);
        this.md.use(superscript);
    }


    @property()
    goBack!: any;

    @property()
    markdownContent: any;


    htmlContent: any;


    requestUpdate(name?: PropertyKey, oldValue?: unknown, options?: PropertyDeclaration<unknown, unknown>): void {
        if (name && name == 'markdownContent' && this.markdownContent !== oldValue) {
            if (this.markdownContent && this.markdownContent.length > 0) {
                const htmlTemplate = this.md.render(this.markdownContent);
                let highlightedCode = Highlighter.findAndHighlightCode(htmlTemplate)
                this.htmlContent = html`${unsafeHTML(highlightedCode)}`;
            }
        }
        return super.requestUpdate(name, oldValue);
    }





    render() {
        return html`
        <div id="markdown-viewer" class="markdown-body">
            ${this.htmlContent}
        </div>
        `
    }

    static get styles() {
        return [MarkdownStyles.getStyles(), Highlighter.getStyles()];
    }
}

