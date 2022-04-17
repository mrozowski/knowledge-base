import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Styles } from './styles';

@customElement('button-x')
export class Button extends LitElement {

    @property()
    text: any = "button";

    @property({ type: Number })
    type: ButtonType = ButtonType.STANDARD;

    setButtonStyle() {
        switch (this.type) {
            case ButtonType.STANDARD: return "standard-btn ";
            case ButtonType.SECONDARY: return "secondary-btn ";
            case ButtonType.SMALL: return "icon-btn small-btn ";
            case ButtonType.LARGE: return "icon-btn large-btn ";
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
            color: var(--textColor);
            text-align: center;
            cursor: pointer;
            transition: color 0.25s ease-out, fill 0.25s ease-out;
            user-select: none;
            width: 5.5em;
            height: 2.5rem;
            line-height: 2.5rem;
        }

        .standard-btn{
            font-weight: 500;
        }

        .standard-btn:hover{
            color: white;
        }

        .secondary-btn{
            font-weight: 300;
        }

        .secondary-btn:hover{
            color: white;
        }

        .icon-btn{
            width: 2em;
            line-height: 2rem;
            display: flex;
            justify-content: center;
            fill: var(--secondary-text-color);
        }

        .icon-btn:hover{
            fill: white;
        }

        .small-btn{
            width: 2.5rem;
        }

        .small-btn > svg{
            width: 1rem;
        }

        .large-btn > svg {
            
        }

        `, Styles.VARIABLES];
    }
}

export enum ButtonType {
    STANDARD,
    SECONDARY,
    SMALL,
    LARGE
}