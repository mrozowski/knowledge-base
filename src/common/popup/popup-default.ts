import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Popup } from './popup';

@customElement('popup-box')
export class PopupDefault extends Popup {

    @property()
    text: string = "";

    @property()
    title: string = "";


    clickOkButton = (): void => {
        this.clickAction();
        this.close();
    }

    createContent() {
        console.log("box");

        return html`
        <div class="title">${this.title}</div>
        <div class="text">${this.text}</div>
        `
    }

    protected static customStyles() {
        return css`
        .title{
            font-size: 1.3rem;
            font-weight: bold;
            padding-bottom: 0.8rem;
        }

        .text{
            font-size: 90%;
            color: var(--secondaryTextColor);
        }
        `;
    }

}