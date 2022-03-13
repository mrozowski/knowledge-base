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

        let items = e.clipboardData.items;

        for (var index in items) {
            var item = items[index];
            if (item.kind === 'file') {
                var blob: Blob = item.getAsFile();

                this.saveFileOnFly(blob);
                // var reader = new FileReader();
                // reader.onload = () => {
                //     this.saveFileOnFly(reader.result);
                // };
                // reader.readAsDataURL(blob);
                //reader.readAsBinaryString(blob);
            }
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