import { css, html, LitElement, PropertyDeclaration } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Icons } from '../../common/icons';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { MarkdownStyles } from '../../common/markdown-styles';
import { Button, ButtonType } from '../button';
import { MarkdownCode as MdCode } from './markdown-code';
import { Styles } from '../../common/styles';

@customElement('edit-section')
export class MarkdownEditor extends LitElement {

    private cursor: number = 0;
    private defaultEditorHeight: number = 0;
    private isPreview: boolean = false;
    private content: any;

    @property()
    saveFileOnFly: any;

    @property()
    contentListener: any;

    firstUpdated() {
        this.defaultEditorHeight = window.innerHeight * 0.9;
        this.addEventListener('paste', this.pasteHandler);
    }

    pasteHandler = (e) => {
        console.log("event handled");
        //later handle loading text before picture is uploaded and then remove that line from textarea
        //this.insertTextAtCursor(e.target.shadowRoot.querySelector("textarea"), "loading image...");
        let items = e.clipboardData.items;

        for (var index in items) {
            var item = items[index];
            if (item.kind === 'file') {
                var blob: Blob = item.getAsFile();
                let htmlLink: Promise<string> = this.saveFileOnFly(blob);
                let target = e.target.shadowRoot.querySelector("textarea");
                htmlLink.then((result) => {
                    let markdownImageLink = this.createMarkdownImageUrl(result);
                    this.insertTextAtCursor(target, markdownImageLink);
                })
            }
        }
    }


    showPreview() {
        this.content = this.shadowRoot!.querySelector("textarea")?.value;
        this.isPreview = true;
        this.requestUpdate();
    }

    showEditor() {
        this.isPreview = false;
        this.requestUpdate();
    }

    getPreview() {
        return html`<markdown-viewer .markdownContent=${this.content}></markdown-viewer>`
    }

    insertCode(value: string) {
        let target = this.shadowRoot!.querySelector("textarea");
        this.insertTextAtCursor(target, value);
        target!.selectionStart = this.cursor;
        target!.selectionEnd = this.cursor;
        target!.focus();
        this.textareaListener(target?.value);
    }

    insertLink() {
        let target = this.shadowRoot!.querySelector("textarea");
        this.insertLinkAtCursor(target, MdCode.link);
        target!.focus();
        this.textareaListener(target?.value);
    }

    wrapCode(value: string) {
        let target = this.shadowRoot!.querySelector("textarea");
        this.wrapTextAtCursor(target, value);
        target!.selectionStart = this.cursor;
        target!.selectionEnd = this.cursor;
        target!.focus();
        this.textareaListener(target?.value);
    }


    render() {
        return html`
        <div class="editor-card">
            <section>
                <button-x .text=${"Edit"}  class="edit" @click=${() => this.showEditor()}></button-x>
                <button-x .text=${"Preview"} @click=${() => this.showPreview()}></button-x>
                <div class="separator"></div>
                <button-x .type=${ButtonType.small} .text=${html`${unsafeHTML(Icons.bold)}`}          @click=${() => this.wrapCode(MdCode.bold)}    title="bold" ></button-x>
                <button-x .type=${ButtonType.small} .text=${html`${unsafeHTML(Icons.italic)}`}        @click=${() => this.wrapCode(MdCode.italic)}  title="italic"></button-x>
                <button-x .type=${ButtonType.small} .text=${html`${unsafeHTML(Icons.strokethrough)}`} @click=${() => this.wrapCode(MdCode.strikethrought)} title="strokethrough"></button-x>
                <button-x .type=${ButtonType.small} .text=${html`${unsafeHTML(Icons.quote)}`}         @click=${() => this.insertCode(MdCode.quote)} title="quote" ></button-x>
                <button-x .type=${ButtonType.small} .text=${html`${unsafeHTML(Icons.code)}`}          @click=${() => this.wrapCode(MdCode.code)} title="code"></button-x>
                <button-x .type=${ButtonType.small} .text=${html`${unsafeHTML(Icons.link)}`}          @click=${() => this.insertLink()} title="insert link"></button-x>
                <button-x .type=${ButtonType.small} .text=${html`${unsafeHTML(Icons.list)}`}          @click=${() => this.insertCode(MdCode.bulletList)} title="bullet list"></button-x>
                <button-x .type=${ButtonType.small} .text=${html`${unsafeHTML(Icons.numericList)}`}   @click=${() => this.insertCode(MdCode.numberedList)} title="numbered list"></button-x>
                <button-x .type=${ButtonType.small} .text=${html`${unsafeHTML(Icons.subscript)}`}     @click=${() => this.wrapCode(MdCode.subscript)} title="subscript"></button-x>
                <button-x .type=${ButtonType.small} .text=${html`${unsafeHTML(Icons.superscript)}`}   @click=${() => this.wrapCode(MdCode.superscript)} title="superscript"></button-x>
                <button-x .type=${ButtonType.small} .text=${html`${unsafeHTML(Icons.table)}`}         @click=${() => this.insertCode(MdCode.table)} title="table" ></button-x>
        
            </section>
        
            <textarea data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false" spellcheck="false"
                @keyup=${(e) => this.textareaListener(e.target.value)} class=${this.isPreview ? "invisible" : ""}></textarea>
        
            ${this.isPreview ? this.getPreview() : null}
        
        </div>
        `
    }

    static get styles() {
        return [Styles.VARIABLES, css`

        .editor-card{
            
        }

        textarea{

            box-sizing: border-box; 
            padding-top: 0.5rem;
            border-radius: 0 0 0.5rem 0.5rem;
            width: 100%;
            max-width: 100%;
            height: 90vh;
            border: none;
            outline: none;
            resize: none;
            overflow: hidden;
            line-height: 1.3rem;
            background-color: transparent;
            color: var(--textColor);
            font-family: Consolas, "Courier New", monospace;
        }
        section{
            display: flex;
            justify-content: flex-start;
            padding-bottom: 1.3rem;
            border-bottom: 2px solid var(--gray)
        }

        
        button-x{
            margin-right: 0.5rem;
        }
        
    
        .edit{
            margin-right: 1rem;
        }

        .invisible{
            display: none;
        }

        .separator{
            flex-grow: 1;
        }
    
        `]
    }


    private createMarkdownImageUrl = (link: string) => {
        return `![image](${link})`;
    }

    private insertTextAtCursor = (myField, myValue) => {

        //IE support remove later
        if (document.selection) {
            myField.focus();
            var sel = document.selection.createRange();
            sel.text = myValue;
        }
        //MOZILLA and others
        else if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;

            if (startPos == endPos) {
                let startText: string = myField.value.substring(0, startPos);
                let indexOfLastNewLine = startText.lastIndexOf("\n");
                if (indexOfLastNewLine != -1) {
                    startText = startText.substring(0, indexOfLastNewLine) + `\n${myValue}` + startText.substring(indexOfLastNewLine + 1);
                } else {
                    startText = myValue + startText.substring(indexOfLastNewLine + 1);
                }
                myField.value = startText

                    + myField.value.substring(endPos, myField.value.length);
                this.cursor = endPos + myValue.length;
            } else {
                var text = myField.value.substring(startPos, endPos);
                text = text.replaceAll("\n", `\n${myValue}`)
                myField.value = myField.value.substring(0, startPos) + myValue + text + myField.value.substring(endPos, myField.value.length);
                this.cursor = startPos + myValue.length + text.length;
            }

        } else {
            myField.value += myValue;
            this.cursor = myValue.length;
        }

    }

    private wrapTextAtCursor = (myField, myValue) => {
        if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;

            if (startPos == endPos) {
                myField.value = myField.value.substring(0, startPos) + myValue + myValue + myField.value.substring(endPos, myField.value.length);
                this.cursor = startPos + myValue.length;
            } else {
                var text = myField.value.substring(startPos, endPos);
                myField.value = myField.value.substring(0, startPos) + myValue + text + myValue + myField.value.substring(endPos, myField.value.length);
                this.cursor = endPos + myValue.length * 2;
            }

        } else {
            myField.value += myValue + myValue;
            this.cursor = myValue.length;
        }
    }

    private insertLinkAtCursor = (myField, linkCode) => {
        if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;

            if (startPos == endPos) {
                myField.value = myField.value.substring(0, startPos) + linkCode + myField.value.substring(endPos, myField.value.length);
                myField.selectionStart = startPos + 3;
                myField.selectionEnd = startPos + 6;
                this.cursor = myField.selectionEnd;
            } else {
                var text = myField.value.substring(startPos, endPos);
                myField.value = myField.value.substring(0, startPos) + "[" + text + "](url)" + myField.value.substring(endPos, myField.value.length);
                myField.selectionStart = text.length + 3;
                myField.selectionEnd = text.length + 6;
                this.cursor = myField.selectionEnd;
            }

        } else {
            myField.value += linkCode;
            myField.selectionStart = 3;
            myField.selectionEnd = 6;
            this.cursor = myField.selectionEnd;
        }

    }

    private textareaListener = (value) => {
        this.contentListener(value);
    }
}