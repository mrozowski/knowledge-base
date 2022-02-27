import { html, LitElement, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('add-button')
export class AddButton extends LitElement {
    render() {
        return html`<div class="round-btn btn"> + </div>`
    }

    static get styles() {
        return css`
        .btn {
            background: linear-gradient(180deg, #1DDEF8 0%, #4780C2 100%);
            color: white;
            border-radius: 0.3rem;
            text-align: center;
            cursor: pointer;
            transition: transform 0.5s ease-out;
            filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
            user-select: none;
        }

        .btn:hover{
            transform: rotate(15deg)
        }

        .btn:active{
            transform: scale(0.99);
            filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
        }

        .round-btn {
            margin-right: 2rem;
            margin-left: 1.5rem;
            width: 3rem;
            height: 3rem;
            border-radius: 1.5rem;
            line-height: 3rem;
            font-size: 2rem;
            font-weight: bold;
           
        }
        `;
    }
}
