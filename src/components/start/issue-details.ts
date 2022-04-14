import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Issue } from '../../model/issue';
import { Category } from './category';
import "./category-badge"
import { ButtonType } from '../button';
import { Datasource } from '../../model/datasource';
import './markdown-viewer'
import { Styles } from '../../common/styles';


@customElement('issue-details')
export class IssueDetails extends LitElement {

    @property()
    issue!: Issue;

    @property()
    goBack!: any;

    @property()
    markdownDescription: any;

    @property()
    id: string = "";

    @property({ type: Object })
    datasource!: Datasource;

    protected firstUpdated(_changedProperties: PropertyValues<any>): void {
        if (this.issue) {
            window.history.pushState("", "", `/documents/${this.issue.id}`);
            this.getContent(this.issue.content);
        } else if (this.id != "") {
            const result = this.datasource.getIssue(this.id);
            result.then(issue => {
                this.issue = issue;
                this.getContent(this.issue.content);
            })
        }
    }

    private getContent(link: string) {
        const descPromise = this.datasource.getFileContent(link);
        descPromise.then(e => {
            this.markdownDescription = e;
        });
    }


    render() {
        console.log("Details render");

        return html`
        <div class="container">
        <div class="card">
                <div class="top-bar">
                    <button-x .text=${"Back"} @click=${() => this.goBack()}></button-x>
                    <div class="separator"></div>
                    <button-x type=${ButtonType.SECONDARY} .text=${"Delete"} @click=${() => this.goBack()}></button-x>
                    <button-x type=${ButtonType.SECONDARY} .text=${"Edit"} @click=${() => this.goBack()}></button-x>
                </div>
            <div class="card-content">
                <h1 class="title">${this.issue.title}</h1>
                
                <section>
                    <span class="tags"> ${this.issue.tags} </span>
                    <div class="separator"></div>
                    <span class="created-date"> ${this.issue.createdAt.toLocaleDateString()} </span>
                    <category-badge .category=${Category[this.issue.category]}></category-badge>
                </section>
        
                <div class="viewer">
                    <markdown-viewer .markdownContent=${this.markdownDescription}></markdown-viewer>
                </div>
                <p class="views">${this.issue.views} views</p>
            </div>
        </div>
        `
    }

    static get styles() {
        return [Styles.VARIABLES, Styles.LARGE_CARD, css`
        .container{
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
        }
        .card-content{
            padding-right: 18px !important;
            padding-left: 18px !important;
            padding-bottom: 18px !important;
        }

        .top-bar{
            background-color: var(--card-background);
            height: 3rem;
            justify-content: space-between;
            align-items: center;
            border-radius: 8px 8px 0 0;
            flex-direction: row;
            display: flex;
         }
         
        section{
            display: flex;
            align-items: center;
            
            border-bottom: solid 3px var(--card-background-lighter);
            padding-bottom: 1rem;
        }

        .viewer{
            margin: 0 1.5rem;
            
        }

        section > span{
            font-weight: 300;
            color: var(--secondary-text-color);
        }

        .tags{
            margin-left: 1rem;
        }

        category-badge{
            margin-right: 1rem;
        }

        .views{
            margin-bottom: 0;
            margin-right: 1rem;
            text-align: right;
            color: var(--secondary-text-color);
        }

        .title{
            margin-left: 1rem;
            margin-right: 1rem;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 400;
        }
        
        .separator{
            flex-grow: 1;
        }

        .created-date{
            margin-right: 1rem;
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
        `];
    }
}

