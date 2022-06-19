import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Document } from '../../model/document';
import { Category } from '../../model/category';
import "../../common/category-badge"
import { ButtonType } from '../../common/button';
import '../../common/popup/popup-default'
import { PopupDefault } from '../../common/popup/popup-default'
import './markdown-viewer'
import { Styles } from '../../common/styles';
import KDatasource from '../../config/configuration';
import { GoBack, LinkTo, Properties } from '../../system/router';
import { Pages } from '../../page-definition';
import { findPhotosInContent } from '../../common/functions';
import { ShowToast, ShowWarningToast } from '../../common/toast/toast';
import { Storage } from '../../adapters/localstorage';


@customElement('docuemnt-details-page')
export class DocumentDetails extends LitElement {

    private static REMOVED_MESSAGE: string = "Document removed.";
    private static REMOVED_ERROR_MESSAGE: string = "Failed to remove the document.";
    private static MARKED_DOCUMENT_NAME = "markedDocument.";
    private errorDescription: string = "";
    private isError: boolean = false;

    @property({ type: Object })
    document!: Document;

    @property()
    id: string = "";

    @property()
    markdownDescription!: string;


    private markDocument(id: string) {
        const markedDoc = Storage.find(DocumentDetails.MARKED_DOCUMENT_NAME + id);
        const dateNow = Date.now();
        if (markedDoc != null) {
            if (Date.parse(markedDoc) < dateNow) {
                KDatasource.incrementViews(id);
                Storage.save(DocumentDetails.MARKED_DOCUMENT_NAME, dateNow);
            }
            return;
        }

        KDatasource.incrementViews(id);
        const tomorrowDate = dateNow + (3600 * 1000 * 24);
        Storage.save(DocumentDetails.MARKED_DOCUMENT_NAME + id, tomorrowDate);
    }

    protected firstUpdated(_changedProperties: PropertyValues<any>): void {
        if (this.document) {
            this.getContent(this.document.content);
            this.markDocument(this.document.id);
        } else {
            if (this.id === "") {
                const a = window.location.href.indexOf("document/");
                this.id = window.location.href.substring(a + 9);
            }
            const result = KDatasource.getIssue(this.id);
            result.then(issue => {
                this.document = issue;
                this.getContent(this.document.content);
                this.markDocument(this.document.id);
            }).catch(() => {
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
        return KDatasource.isLogin() && KDatasource.getCurrentUser()?.id == this.document.authorId;
    }

    private openConfirmBox = () => {
        const confirmBox = this.shadowRoot?.querySelector('popup-box') as PopupDefault;

        confirmBox.clickAction = this.deleteDocument
        confirmBox.title = "Confirm action";
        confirmBox.text = "Do you want to delete this document?";
        confirmBox.open = true;
    }


    private deleteDocument = () => {
        // check if there are pictures and remove them and then remove document
        const foundPhotos = findPhotosInContent(this.markdownDescription);
        KDatasource.removePictures(foundPhotos)
            .then(() => KDatasource.removeDocument(this.document.id)
                .then(() => {
                    ShowToast(DocumentDetails.REMOVED_MESSAGE);
                    GoBack();
                })
                .catch(() => {
                    ShowWarningToast(DocumentDetails.REMOVED_ERROR_MESSAGE);
                }))
            .catch(() => {
                ShowWarningToast(DocumentDetails.REMOVED_ERROR_MESSAGE);
            });
    }


    private handleDeleteButton = () => {
        this.openConfirmBox();
    }

    optionButtons = () => {
        if (this.isDocumentBelongToCurrentUser()) {
            return html`
            <button-x 
                class="option-button"
                .type=${ButtonType.SECONDARY} 
                .text=${"Delete"} 
                @click=${() => this.handleDeleteButton()}>
            </button-x>
            <button-x 
                class="option-button"
                type=${ButtonType.SECONDARY} 
                .text=${"Edit"}
                @click=${() => LinkTo(Pages.EDITOR, Properties.create("document", this.document).add("mContent", this.markdownDescription))}>
            </button-x>
            `
        }
        return null;
    }


    render() {

        if (this.isError) {
            return html`
            <div class="container">
                <p> ${this.errorDescription} </p>
            </div>
            `
        }
        if (!this.document) {
            return html`
            <div class="spinner">
                <spinner-box></spinner-box>
            </div>`;
        }

        return html`
        <popup-box></popup-box>
        
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
                        <span class="tags"> ${this.document.tags.join(", ")} </span>
                        <div class="separator"></div>
                        <span class="created-date"> ${new Date(this.document.createdAt).toLocaleDateString('pl-PL', { day: '2-digit', month: 'numeric', year: 'numeric' })} </span>
                        <category-badge .category=${Category[this.document.category]}></category-badge>
                    </section>
            
                    <div class="viewer">
                        ${this.markdownDescription ? html`<markdown-viewer .markdownContent=${this.markdownDescription}></markdown-viewer>`
                :
                html`<div class="spinner"> <spinner-box></spinner-box> </div>`}
                    </div>
                    <p class="views">${this.document.views} views</p>
                </div>
            </div>
        </div>
        `
    }

    static get styles() {
        return [Styles.VARIABLES, Styles.LARGE_CARD, Styles.SPINNER,
        css`
        .container{
            padding-left: 1.0rem !important;
            padding-right: 1.0rem !important;
        }
        .card-content{
            padding-right: 1rem !important;
            padding-left: 1rem !important;
            padding-bottom: 1rem !important;
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
            padding: 0 1rem 1rem 1rem;
        }

        .viewer{
            margin: 0 1.5rem;
            
        }

        section > span{
            font-weight: 300;
            color: var(--secondary-text-color);
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

        @media (max-width: 768px){
            .container{
                padding-left: 0.75rem !important;
                padding-right: 0.75rem !important;
            }

            .card-content{
                padding-right: 0.8rem !important;
                padding-left: 0.8rem !important;
                padding-bottom: 0.8rem !important;
            }

            .title{
                margin-left: 0;
                margin-right: 0;
                font-size: 1.5rem;
            }

            section{
                padding: 0 0.2rem 0.8rem 0.2rem;
                flex-wrap: wrap;
            }

            .tags{
                align-self: start;
                width: 100%;
                margin-bottom: 0.5rem;
            }

            .created-date{
                flex-grow: 1;
                text-align: right;
            }
            
            .viewer{
                margin: 0;
            }

            .option-button{
                display: none;
            }

            .views{
                margin-right: 0.2rem;
            }
        }

        @media (min-width: 768px){

        }

        @media (min-width: 1012px){

       }
        `];
    }
}

