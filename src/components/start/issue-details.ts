import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Issue } from '../../model/issue';
import { Category } from './category';
import "./category-badge"
import { ButtonType } from '../button';
import { Datasource } from '../../model/datasource';
import './markdown-viewer'
import { MarkdownStyles } from '../../common/markdown-styles';



@customElement('issue-details')
export class IssueDetails extends LitElement {


    @property()
    issue!: Issue;

    @property()
    goBack!: any;

    @property()
    markdownDescription: any;

    @property({ type: Object })
    datasource!: Datasource;

    protected firstUpdated(_changedProperties: PropertyValues<any>): void {
        window.history.pushState("", "", `/${this.issue.id}`);
        const descPromise = this.datasource.getFileContent(this.issue.description);
        descPromise.then(e => {
            this.markdownDescription = e;
        });
    }

    render() {
        return html`
        <div class="container">
            <div class="issue-card-details">
        
                <section>
                    <button-x type=${ButtonType.small} .text=${"Back"} @click=${() => this.goBack()}></button-x>
                    <span class="created-date"> ${this.issue.createdAt.toLocaleDateString()} </span>
                    <category-badge .category=${Category[this.issue.category]}></category-badge>
                </section>
        
                <h1 class="title">${this.issue.title}</h1>
                <markdown-viewer .markdownContent=${this.markdownDescription}></markdown-viewer>
            </div>
        </div>
        `
    }

    static get styles() {
        return [css`
        .container{
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
        }
        .issue-card-details{
            max-width: 80rem;
            background-color: rgba(255, 255, 255, 0.06);
            color: var(--textColor);
            margin: 0.5rem auto;
            padding: 16px !important;
            border-radius: 0.5rem;
            box-shadow: -2px -2px 6px 2px rgba(255, 255, 255, 0.1), 2px 2px 6px 2px rgba(0, 0, 0, 0.25);
        }
        section{
            display: flex;
            justify-content: space-between;
        }
        .title{
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
        }
        
        button-x{
            flex-grow: 1;
        }

        .created-date{
            line-height: 2.6rem;
            margin-right: 0.7rem;
        }

        @media (min-width: 768px){
            .issue-card-details {

                padding-right: 24px !important;
                padding-left: 24px !important;
            }
        }

        @media (min-width: 1012px){
            .issue-card-details {
                
                
                padding-right: 32px !important;
                padding-left: 32px !important;
            }
       }
        `, MarkdownStyles.getVariableStyles()];
    }
}

