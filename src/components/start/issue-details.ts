import { css, html, LitElement, PropertyValues } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { customElement, property } from 'lit/decorators.js';
import { Issue } from '../../model/issue';
import { Category } from './category';
import "./category-badge"
import { ButtonType } from '../button';
import { Datasource } from '../../model/datasource';
import { MarkdownStyles } from '../../common/markdown-styles';

var MarkdownIt = require('markdown-it');
var hljs = require('highlight.js/lib/common');


@customElement('issue-details')
export class IssueDetails extends LitElement {

    private md = new MarkdownIt({ html: true });

    @property()
    issue!: Issue;

    @property()
    description!: any;

    @property({ type: Object })
    datasource!: Datasource;

    protected firstUpdated(_changedProperties: PropertyValues<any>): void {
        const descPromise = this.datasource.getFileContent(this.issue.description);
        descPromise.then(e => {
            const htmlTemplate = this.md.render(e);
            this.description = html`${unsafeHTML(htmlTemplate)}`;
        });
    }

    render() {

        return html`
        <div class="issue-card-details">
            <section>
                <button-x type=${ButtonType.small} .text=${"Back"} @click=${()=> console.log("pam pam")}></button-x>
                <category-badge .category=${Category[this.issue.category]}></category-badge>
            </section>
        
            <h3 class="title">${this.issue.title}</h3>
            <div id="markdown-viewer" class="markdown-body">
        
                ${this.description}
        
            </div>
        </div>
        `
    }

    static get styles() {
        return [css`
        .issue-card-details{
            min-width: 35rem;
            max-width: 50rem;
            
            background-color: rgba(255, 255, 255, 0.06);
            color: white;
            margin: 0.5rem auto;
            padding: 0.5rem;
            border-radius: 0.5rem;
            box-shadow: -2px -2px 6px 2px rgba(255, 255, 255, 0.1), 2px 2px 6px 2px rgba(0, 0, 0, 0.25);
        }
        section{
            display: flex;
            justify-content: space-between;
        }
        `, MarkdownStyles.getStyles()];
    }
}

