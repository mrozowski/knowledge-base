import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MarkdownStyles } from '../../common/markdown-styles';
import { Datasource } from '../../model/datasource';
import { Issue } from '../../model/issue';
import { Category } from '../start/category';
import { v4 as uuidv4 } from 'uuid';
import './markdown-editor'


@customElement('create-issue')
export class CreateIssue extends LitElement {

    private content: string = "";
    private tags: string[] = new Array();

    @property({ type: Object })
    datasource!: Datasource;

    @property()
    goBack: any

    createUniqueFileName(): string {
        // timestamp is good way to create unique name. However, if many people use website it might happend that two people upload file at this same time.
        // then there will be issue on server side - duplication of file name. However, for now only I'll have access to upload files. So it's good enought.
        let timestamp = Date.now();
        return timestamp + ".png";
    }

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
    }

    updateContent = (newContent: string) => {
        this.content = newContent;
    }

    storeFile = (file: Blob): Promise<string> => {
        let fileName = this.createUniqueFileName();
        let ref = this.datasource.storePicture(file, fileName);
        return ref;
    }

    submitIssue() {
        console.log("submitting a new issue");
        let author = "funner";
        let category: HTMLSelectElement = this.shadowRoot!.querySelector("#category-list") as HTMLSelectElement;
        let title: HTMLInputElement = this.shadowRoot!.querySelector("#title-input") as HTMLInputElement;
        let tags: HTMLInputElement = this.shadowRoot!.querySelector("#tag-input") as HTMLInputElement;
        let parsedTags: string[] = tags.value.split("/[\s,]+/");
        let id: string = uuidv4();

        let mdUrl = this.datasource.uploadMarkdown(this.content, id);

        mdUrl.then(md => {
            let issue: Issue = new Issue(
                author,
                category.value,
                new Date(),
                title.value,
                parsedTags,
                0,
                id,
                md,
                true
            );

            this.datasource.createNewIssue(issue).then(e => {
                console.log("Issue created");
                // show some prompt 
            })
        })
    }

    tagListener(value: string) {

    }

    render() {
        return html`
        <div class="container">
            <div class="issue-card-creator">
                <section>
                    <button-x .text=${"Cancel"} @click=${() => this.goBack()}></button-x>
                    <button-x .text=${"Submit"} @click=${this.submitIssue}></button-x>
                </section>
                <div class="options">
                <label>Title: 
                    <input name="title" id="title-input"/>
                </label>
                <label>Category:
                    <select id="category-list"></select>
                </label>
                <div></div>
                <label>Tags:  
                    <input  type="text" id="tag-input"/>
                </label>
                </div>
                <edit-section .saveFileOnFly=${this.storeFile} .contentListener=${this.updateContent}></edit-section>
            </div>

            
        </div>
        `

    }

    static get styles() {
        return [MarkdownStyles.getVariableStyles(), css`
        .container{
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
        }
        .issue-card-creator{
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
            border-bottom: 2px solid var(--gray);
            padding-bottom: 1.3rem;
            margin-bottom: 1.3rem;
        }

        .options{
            border-bottom: 2px solid var(--gray);
            padding-bottom: 1.3rem;
            margin-bottom: 1.3rem;
        }

        input{
            background-color: transparent;
            border: none;
            outline: none;
            resize: none;
            color: var(--textColor);
            margin: 0 0 0.5rem 0.5rem;
            width: 88%;
        }

        #title-input{
            font-size: 1.5rem;
        }

        #category-list{
            margin-bottom: 0.5rem;
        }

        .created-date{
            line-height: 2.6rem;
            margin-right: 0.7rem;
        }

        @media (min-width: 768px){
            .issue-card-creator {

                padding-right: 24px !important;
                padding-left: 24px !important;
            }

            input{
                width: 92%;
            }
        }

        @media (min-width: 1012px){
            .issue-card-creator {
                padding-right: 32px !important;
                padding-left: 32px !important;
            }

            input{
                width: 94%;
            }
       }`]
    }
}