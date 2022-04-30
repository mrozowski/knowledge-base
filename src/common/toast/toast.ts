import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Styles } from '../styles';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { ButtonType } from '../button';

@customElement("toast-box")
export class Toast extends LitElement {

    @property({ type: Boolean })
    open: boolean;

    @property({ type: String })
    text: string = "";

    clickAction: any;

    constructor() {
        super();
        this.open = false;
    }

    close() {
        this.open = false;
    }

    show() {
        this.open = true;
        setTimeout(() => this.open = false, 5000);
    }

    render() {
        return html`
        <div class="container ${this.open ? "show" : "hidden"}" >
            <div class="toast">
                <div class="toast-text">
                    ${this.text}
                </div>
                <div class="toast-close-button" @click=${() => this.close()}>
                    
                    ${html`${unsafeHTML(Toast.CLOSE_BUTTON)}`}
                </div>
            </div>
        </div>
        `
    }

    static get styles() {
        return [
            Styles.VARIABLES,
            css`
            .container{
                transition: all 0.25s ease-out;
                position: fixed;
                background-color: var(--main-accent-color);
                box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
                border-radius: 8px;
                transform: translateY(0.5rem);
                width: 21rem;
                min-height: 2.7rem;
                color: var(--textColor);
                margin: 2rem;
                z-index: 10;
                bottom: 0;
                right: 0;
            }

            .show{
                transform: translateY(0rem);
                opacity: 1;
            }

            .hidden{
                visibility: hidden;
                opacity: 0;
                //display: none; 
            }

            .toast{
                display: flex;
                margin: 0.5rem;
                font-size: .875rem;
                align-items: center;
            }

            .toast-close-button{
                box-sizing: content-box;
                margin-right: 0.5rem;
                display: flex;
                padding-top: 2px;
                margin: auto;
                margin-right: 5px;
                width: 1rem;
                fill: var(--secondary-text-color);
                cursor: pointer;
            }

        
            .d-flex{
                display: flex;
            }

            .box-content{
                padding: 0.9rem 1rem;
            }       
       `]
    }

    private static CLOSE_BUTTON: string = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>`
}