import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Document } from '../../model/document';
import { Category } from '../../model/category';
import "../../common/category-badge"
import { ButtonType } from '../../common/button';
import './markdown-viewer'
import { Styles } from '../../common/styles';
import KDatasource from '../../config/configuration';
import { GoBack, LinkTo, Properties } from '../../system/router';
import { Pages } from '../../page-definition';
import { CompoundDocument } from '../../model/compact-document';


@customElement('docuemnt-details-page')
export class DocumentDetails extends LitElement {

    private errorDescription: string = "";
    private isError: boolean = false;

    @property({ type: Object })
    document!: Document;

    @property()
    id: string = "";

    @property()
    markdownDescription: string = "";




    protected firstUpdated(_changedProperties: PropertyValues<any>): void {
        if (this.document) {
            this.getContent(this.document.content);
        } else {
            if (this.id === "") {
                const a = window.location.href.indexOf("document/");
                this.id = window.location.href.substring(a + 9);
            }
            const result = KDatasource.getIssue(this.id);
            result.then(issue => {
                this.document = issue;
                this.getContent(this.document.content);
            }).catch(error => {
                this.isError = true;
                this.errorDescription = `Could not find document with id: ${this.id}`;
                this.requestUpdate();
            });
        }
    }

    private getContent(link: string) {
        const descPromise = KDatasource.getFileContent(link);
        descPromise.then(e => {
            this.markdownDescription = e;
        });
    }

    private isDocumentBelongToCurrentUser = (): boolean => {
        return KDatasource.isLogin() && KDatasource.getCurrentUser()?.id == this.document.authorId
    }

    optionButtons = () => {
        if (this.isDocumentBelongToCurrentUser()) {
            return html`
            <button-x type=${ButtonType.SECONDARY} .text=${"Delete"} @click=${() => GoBack()}></button-x>
            <button-x 
                type=${ButtonType.SECONDARY} 
                .text=${"Edit"}
                @click=${() => LinkTo(Pages.EDITOR, Properties.create("document", this.document).add("mContent", this.markdownDescription))}>
            </button-x>
            `
        }
    }


    render() {
        console.log("Details render");
        if (this.isError) {
            return html`
            <div class="container">
                <p> ${this.errorDescription} </p>
            </div>
            `
        }
        if (!this.document) {
            return html`
            <div class="container">Loading</div>`;
        }

        return html`
        <div class="container">
        <div class="card">
                <div class="top-bar">
                    <button-x .text=${"Back"} @click=${() => GoBack()}></button-x>
                    <div class="separator"></div>

                    ${this.optionButtons()}
                </div>
            <div class="card-content">
                <h1 class="title">${this.document.title}</h1>
                
                <section>
                    <span class="tags"> ${this.document.tags} </span>
                    <div class="separator"></div>
                    <span class="created-date"> ${new Date(this.document.createdAt).toLocaleDateString()} </span>
                    <category-badge .category=${Category[this.document.category]}></category-badge>
                </section>
        
                <div class="viewer">
                    <markdown-viewer .markdownContent=${this.markdownDescription}></markdown-viewer>
                </div>
                <p class="views">${this.document.views} views</p>
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

