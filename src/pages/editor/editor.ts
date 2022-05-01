import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MarkdownStyles } from '../../common/markdown-styles';
import { Datasource } from '../../model/datasource';
import { Document } from '../../model/document';
import { Category } from '../../model/category';
import { v4 as uuidv4 } from 'uuid';
import './markdown-editor'
import '../../common/switch'
import { Styles } from '../../common/styles';
import { ButtonType } from '../../common/button';
import KDatasource from '../../config/configuration';
import { GoBack, LinkTo, PathVariable, Properties, ReplaceTo } from '../../system/router';
import { Pages } from '../../page-definition';
import { findPhotosInContent } from '../../common/functions';
import { ShowToast, ShowWarningToast } from '../../common/toast/toast';
import { Switch } from '../../common/switch';



@customElement('editor-page')
export class Editor extends LitElement {

    private static SAVED_MESSAGE: string = "Document saved.";
    private static SAVED_ERROR_MESSAGE: string = "Failed to save the document.";
    private content: string = Editor.getDefaultTemplate();
    private tags: string[] = new Array();
    private photos: string[] = new Array();

    @property({ type: Object })
    document?: Document;

    @property()
    mContent: any;

    firstUpdated() {
        let category: HTMLSelectElement = this.shadowRoot!.querySelector("#category-list") as HTMLSelectElement;
        for (let item in Category) {
            if (isNaN(Number(item))) {
                let element: HTMLOptionElement = <HTMLOptionElement>(document.createElement('option'));
                element.value = item;
                element.text = item;
                category.add(element);
            }
        }

        if (this.isEditingExistingDocument()) {
            // Edit existing document

            this.setDocumentValues();
            this.requestUpdate();
        }
    }


    setDocumentValues() {
        const category: HTMLSelectElement = this.shadowRoot!.querySelector("#category-list") as HTMLSelectElement;
        const title: HTMLInputElement = this.shadowRoot!.querySelector("#title-input") as HTMLInputElement;
        const tags: HTMLInputElement = this.shadowRoot!.querySelector("#tag-input") as HTMLInputElement;
        const publicSwitch: Switch = this.shadowRoot!.querySelector("switch-box") as Switch;

        title.value = this.document!.title;
        category.value = this.document!.category;
        tags.value = this.document!.tags.join(", ");
        this.content = this.mContent;
        publicSwitch.switchState = this.document!.isPublic;
        this.photos = findPhotosInContent(this.content);
    }

    updateDocument() {
        const user = KDatasource.getCurrentUser();
        if (user === undefined) throw new Error("User is not logged in");
        const category: HTMLSelectElement = this.shadowRoot!.querySelector("#category-list") as HTMLSelectElement;
        const title: HTMLInputElement = this.shadowRoot!.querySelector("#title-input") as HTMLInputElement;
        const tags: HTMLInputElement = this.shadowRoot!.querySelector("#tag-input") as HTMLInputElement;
        const publicSwitch: Switch = this.shadowRoot!.querySelector("switch-box") as Switch;
        const parsedTags: string[] = tags.value.split("/[\s,]+/");
        const id: string = this.document!.id


        this.removeUnusedPhotos();
        const description = this.parseDescription(this.content);

        const mdUrl = KDatasource.uploadMarkdown(this.content, id);
        mdUrl.then(md => {
            let document: Document = new Document(
                this.document!.author,
                this.document!.authorId,
                category.value,
                this.document!.createdAt,
                new Date(),
                title.value,
                parsedTags,
                this.document!.views,
                id,
                md,
                description,
                publicSwitch.switchState
            );

            KDatasource.modifyDocument(document).then(() => {
                ShowToast(Editor.SAVED_MESSAGE);
                window.history.back();
                ReplaceTo(Pages.DOCUMENT, PathVariable.create(id), Properties.create("id", id).add("document", document).add("markdownDescription", this.content));
            })
        })
    }

    /** It removes photos that were removed during editing document.
         *  In the future it might be good to remove picture in a single batch then removing one by one.
     */
    private removeUnusedPhotos() {
        const editedPhotos = findPhotosInContent(this.content);
        const removedPhotos = this.getRemovedPhotos(editedPhotos);
        if (removedPhotos.length == 0) return;
        KDatasource.removePictures(removedPhotos);
    }

    /** 
        It returns list of pictures name that were removed from content after editing.
    */
    private getRemovedPhotos(editedPhotos: string[]): string[] {
        const result: string[] = [];
        this.photos.forEach(photo => {
            const isNotExist = editedPhotos.indexOf(photo) === -1;
            if (isNotExist) result.push(photo);
        });
        return result;
    }

    submitNewDocument() {
        const user = KDatasource.getCurrentUser();
        if (user === undefined) throw new Error("User is not logged in");
        const category: HTMLSelectElement = this.shadowRoot!.querySelector("#category-list") as HTMLSelectElement;
        const title: HTMLInputElement = this.shadowRoot!.querySelector("#title-input") as HTMLInputElement;
        const tags: HTMLInputElement = this.shadowRoot!.querySelector("#tag-input") as HTMLInputElement;
        const publicSwitch: Switch = this.shadowRoot!.querySelector("switch-box") as Switch;
        const parsedTags: string[] = tags.value.split("/[\s,]+/");
        const id: string = uuidv4();
        const description = this.parseDescription(this.content);

        let mdUrl = KDatasource.uploadMarkdown(this.content, id);

        mdUrl.then(md => {
            const createTime = new Date();
            let document: Document = new Document(
                user.username,
                user.id,
                category.value,
                createTime,
                createTime,
                title.value,
                parsedTags,
                0,
                id,
                md,
                description,
                publicSwitch.switchState
            );

            KDatasource.createNewIssue(document).then(e => {
                ShowToast(Editor.SAVED_MESSAGE);
                GoBack();
            }).catch(e => {
                ShowWarningToast(Editor.SAVED_ERROR_MESSAGE);
            });
        }).catch(e => {
            ShowWarningToast(Editor.SAVED_ERROR_MESSAGE);
        });
    }

    private isEditingExistingDocument = (): boolean => {
        return this.mContent && this.document;
    }

    onSaveClick = () => {
        if (this.isEditingExistingDocument()) {
            this.updateDocument();
        } else {
            this.submitNewDocument();
        }
    }

    onCancelClick = () => {
        // if (!this.isEditingExistingDocument()){
        //     const editedPhotos = findPhotosInContent(this.content);
        //     const removedPhotos = this.getRemovedPhotos(editedPhotos);
        //     if (removedPhotos.length == 0) return;
        //     KDatasource.removePictures(removedPhotos);
        // }
        GoBack();
    }

    render() {
        console.log("Creator render");
        if (!KDatasource.isLogin()) {
            GoBack();
        }
        return html`
        <div class="container">
            <div class="card">
                <div class="top-bar">
                        <button-x .text=${"Cancel"} @click=${() => this.onCancelClick()} .type=${ButtonType.SECONDARY}></button-x>
                        <button-x .text=${"Save"} @click=${this.onSaveClick}></button-x>
                </div>
                <div class="card-content">
                    <div class="options">
                        <label>Title 
                            <input type="text" name="title" id="title-input"/>
                        </label>
                        <label>Tags  
                            <input type="text" name="tags" id="tag-input"/>
                        </label>
                        <!-- <div class="d-flex"> -->
                            <label>Category
                                <select id="category-list" class="select-card"></select>
                            </label> 
                            <label class="checkbox-label">Public
                                <switch-box .switchState=${true}></switch-box>
                            </label> 
                        <!-- </div> -->
                        

                        
                    </div>
                    <edit-section .saveFileOnFly=${this.storeFile} .contentListener=${this.updateContent} .defaultContent=${this.content}></edit-section>
                </div>
            </div>
        </div>
        `

    }

    static get styles() {
        return [Styles.VARIABLES, Styles.LARGE_CARD, css`

        .select-card{
            background-color: #35333b;
            color: var(--textColor);
            border: none;
            padding: 0.3rem;
            width: 8em;
        }
        .select-card:focus{
            outline: none;
        }

        switch-box{
            margin-left: 1.7rem;
        }

        .checkbox-label{
            display: flex;
            align-items: center;
        }

        .container{
            
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
            min-width: 46.5rem;
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

        .options{
            padding: 1.3rem 0 1.8rem 0;
        }

        input, label {
            display:block;
        }

        label{
            color: var(--secondary-text-color);
            font-size: 80%;
        }

        label:not(:first-of-type){
            margin-top: 0.8rem;
        }

        input{
            background-color: var(--card-background);
            border: none;
            border-radius: 0 8px 8px 8px;
            outline: none;
            resize: none;
            color: var(--textColor);
            width: 100%;
            margin-top: 0.2rem;
            height: 2.5rem;
            padding: 0 0.5rem;
            -moz-box-sizing: border-box; 
            -webkit-box-sizing: border-box; 
            box-sizing: border-box; 
        }

        input[type='checkbox']{
            height: unset;
            width: unset;
            padding: unset;
            margin-top: unset;
            display: unset;
            vertical-align: middle;
            position: relative;
        }

        #title-input{
            font-size: 1.5rem;
        }

        #category-list{
            margin-left: 0.5rem;
            margin-top: 0.5rem;
        }

        .created-date{
            line-height: 2.6rem;
            margin-right: 0.7rem;
        }

        @media (min-width: 768px){
            .card-content {

                padding-right: 24px !important;
                padding-left: 24px !important;
                padding-bottom: 24px !important;
            }

            
        }

        @media (min-width: 1012px){
            .card-content {
                padding-right: 32px !important;
                padding-left: 32px !important;
                padding-bottom: 32px !important;
            }

            
       }`]
    }


    private parseDescription(content: string) {
        const descriptionHeader = "## Description";
        const descriptionHeaderIndex = content.indexOf(descriptionHeader);

        const descriptionStart = descriptionHeaderIndex + descriptionHeader.length + 1;
        const descriptionEnd = content.indexOf("\n\n", descriptionStart);

        let code = content.substring(descriptionStart, descriptionEnd);
        const wrongElement = code.indexOf("\n#", descriptionStart);
        if (wrongElement != -1) {
            code = code.substring(0, wrongElement);
        }
        if (code.length > 320) {
            return code.substring(0, 320);
        }
        return code;
    }

    private tagListener(value: string) {

    }

    private createUniqueFileName(): string {
        // timestamp is good way to create unique name. However, if many people use website it might happend that two people upload file at this same time.
        // then there will be issue on server side - duplication of file name. However, for now only I'll have access to upload files. So it's good enought.
        let timestamp = Date.now();
        return timestamp + ".png";
    }

    private updateContent = (newContent: string) => {
        this.content = newContent;
    }

    private storeFile = (file: Blob): Promise<string> => {
        let fileName = this.createUniqueFileName();
        let ref = KDatasource.storePicture(file, fileName);
        return ref;
    }

    private static getDefaultTemplate(): string {
        return `## Description



## Solution

`;
    }
}