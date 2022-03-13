import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';



@customElement('edit-section')
export class Editor extends LitElement {

    private editor: any;

    @property()
    saveFileOnFly: any;

    firstUpdated() {
        this.addEventListener('paste', this.pasteHandler);
    }

    pasteHandler = (e) => {
        console.log("event handled");
        this.insertTextAtCursor(e.target.shadowRoot.querySelector("textarea"), "loading image...");
        let items = e.clipboardData.items;

        for (var index in items) {
            var item = items[index];
            if (item.kind === 'file') {
                var blob: Blob = item.getAsFile();
                let htmlLink: Promise<string> = this.saveFileOnFly(blob);
                let target = e.target.shadowRoot.querySelector("textarea");
                htmlLink.then((result) => {
                    console.log("link: " + result);

                    let markdownImageLink = this.createMarkdownImageUrl(result);
                    this.insertTextAtCursor(target, markdownImageLink);
                })


            }
        }

    }

    createMarkdownImageUrl = (link: string) => {
        return `![image](${link})`;
    }

    insertTextAtCursor = (myField, myValue) => {
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

    render() {
        return html`
        <div class="editor-card">
            <textarea> </textarea>
        </div>
        `
    }

    static get styles() {
        return css`

        .editor-card{
            
        }

        textarea{
            width: 100%;
            max-width: 100%;
            border: none;
            outline: none;
        }

    
        `
    }
}