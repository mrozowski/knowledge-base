import { html, LitElement, PropertyDeclaration, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { MarkdownStyles } from '../../common/markdown-styles';
import { Highlighter } from '../../common/highlight';

var markdownIt = require('markdown-it');
var emoji = require('markdown-it-emoji');
var subscript = require('markdown-it-sub');

@customElement('markdown-viewer')
export class MarkdownViewer extends LitElement {

    private md: any;
    constructor() {
        super();
        this.md = new markdownIt({ typographer: true, linkify: true });
        this.md.use(emoji);
        this.md.use(subscript);
    }


    @property()
    goBack!: any;

    @property()
    markdownContent: any;

    @property()
    htmlContent: any;


    requestUpdate(name?: PropertyKey, oldValue?: unknown, options?: PropertyDeclaration<unknown, unknown>): void {
        console.log("update: " + name);
        console.log(oldValue);

        if (name && name == 'markdownContent' && this.markdownContent !== oldValue) {
            if (this.markdownContent && this.markdownContent.length > 0) {
                console.log("rendering");

                const htmlTemplate = this.md.render(this.markdownContent);
                console.log("rendered");
                let highlightedCode = Highlighter.findAndHighlightCode(htmlTemplate)
                console.log("highliting");
                this.htmlContent = html`${unsafeHTML(highlightedCode)}`;
                console.log("set");
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

