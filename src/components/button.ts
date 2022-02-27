import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('button-x')
export class Button extends LitElement {

    @property()
    text = "button";

    @property({ type: Number })
    type: ButtonType = ButtonType.standard;


    render() {
        if (this.type === ButtonType.cross) {
            return html`
            <div class="cross btn"> </div>
            `
        } else {
            return html`
            <div class="${this.type === ButtonType.standard ? " standard-btn" : "small-btn"} btn">
                ${this.text}
            </div>
            `
        }
    }

    static get styles() {
        return css`
        .btn {
            background-color: #434b52;
            color: white;
            border-radius: 0.3rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.75s ease-out;
            user-select: none;
        }

        .btn:hover{
            background-color: #4093CD;
        }

        .standard-btn {
            width: 5.5em;
            height: 2rem;
            line-height: 2rem;
        }

        .small-btn {
            width: 4em;
            height: 2rem;
            line-height: 2rem;
        }
        `;
    }
}

export enum ButtonType {
    standard,
    small,
    cross
}