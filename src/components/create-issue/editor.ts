import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MarkdownStyles } from '../../common/markdown-styles';
import { Button } from '../button';

@customElement('edit-section')
export class Editor extends LitElement {

    private editor: any;
    private defaultEditorHeight: number = 0;

    @property()
    saveFileOnFly: any;

    firstUpdated() {
        this.defaultEditorHeight = window.innerHeight * 0.9;
        console.log(this.defaultEditorHeight);

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

    render() {
        return html`
        <div class="editor-card">
            <section>
                <button-x .text=${"Editor"}></button-x>
                <button-x .text=${"Preview"}></button-x>
            </section>
            <textarea data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false"
                @keypress=${(e)=> this.autoGrow(e.target)}> </textarea>
        </div>
        `
    }

    static get styles() {
        return [MarkdownStyles.getVariableStyles(), css`

        .editor-card{
            
        }

        textarea{
            margin-top: 0.5rem;
            width: 100%;
            max-width: 100%;
            height: 90vh;
            border: none;
            outline: none;
            resize: none;
            overflow: hidden;
            background-color: transparent;
            color: var(--textColor);
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
        }
        section{
            display: flex;
            justify-content: flex-start;
            padding-bottom: 1.3rem;
            border-bottom: 2px solid var(--gray)
        }
        button-x{
            margin-right: 1.5rem;
        }
    
        `]
    }


    private createMarkdownImageUrl = (link: string) => {
        return `![image](${link})`;
    }

    private insertTextAtCursor = (myField, myValue) => {
        console.log(myField);

        //IE support
        if (document.selection) {
            myField.focus();
            var sel = document.selection.createRange();
            sel.text = myValue;
        }
        //MOZILLA and others
        else if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;
            myField.value = myField.value.substring(0, startPos)
                + myValue
                + myField.value.substring(endPos, myField.value.length);
        } else {
            myField.value += myValue;
        }
    }

    private autoGrow = (element) => {


    }
}