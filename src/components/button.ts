import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Styles } from '../common/styles';

@customElement('button-x')
export class Button extends LitElement {

    @property()
    text: any = "button";

    @property({ type: Number })
    type: ButtonType = ButtonType.standard;

    setButtonStyle() {
        switch (this.type) {
            case ButtonType.standard: return "standard-btn ";
            case ButtonType.secondary: return "secondary-btn ";
            case ButtonType.small: return "small-btn ";
        }
    }

    render() {

        return html`
        <div class="${this.setButtonStyle()} btn">
            ${this.text}
        </div>
        `

    }

    static get styles() {
        return [css`
        .btn {
            color: white;
           
            text-align: center;
            cursor: pointer;
            transition: all 0.75s ease-out;
            user-select: none;
            width: 5.5em;
            height: 2.5rem;
            line-height: 2.5rem;
        }

        .standard-btn {
            
        }

        .secondary-btn{
            font-weight: 100;
        }

        .small-btn {
            width: 2em;
            height: 2rem;
            line-height: 2rem;
            display: flex;
            justify-content: center;
            align-content: center;
            font-weight: 100;
        }

        svg{
            fill: var(--textColor);
            width: 1rem;
        }
        `, Styles.VARIABLES];
    }
}

export enum ButtonType {
    standard,
    secondary,
    small
}