import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Styles } from '../styles';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';


type ToastType = "message" | "warning"

class ToastElement {
    constructor(
        readonly message: string,
        readonly type: ToastType = "message") { }
}

@customElement("toast-box")
export class Toast extends LitElement {

    @property({ type: Array })
    elements: ToastElement[] = [];

    show(message: string, type: ToastType = "message") {
        const newToast = new ToastElement(message, type);

        setTimeout(() => {
            this.removeToast(newToast);
            this.requestUpdate("elements");
        }, 6000);
        this.elements.push(newToast);
        this.requestUpdate("elements")
    }

    removeToast(toast: ToastElement) {
        var index = this.elements.indexOf(toast);
        if (index !== -1) {
            this.elements.splice(index, 1);
        }
    }

    toastStyle(toast: ToastElement): string {
        let style = "toast ";
        switch (toast.type) {
            case "message": style += "message"; break;
            case "warning": style += "warning"; break;
        }

        return style;
    }

    render() {
        return html`
        <div class="container" >
            ${this.elements.map(toast => html`
                <div class=${this.toastStyle(toast)}>
                    <div class="toast-body">
                        <div class="toast-text">
                            ${toast.message}
                        </div>
                        <div class="toast-close-button" @click=${() => { this.removeToast(toast); this.requestUpdate("elements") }}>
                            ${html`${unsafeHTML(Toast.CLOSE_BUTTON)}`}
                        </div>
                    </div>
                </div>
                `
        )}
        </div>
        `
    }

    static get styles() {
        return [
            Styles.VARIABLES,
            css`
            .container{
                position: fixed;
                margin: 2rem;
                z-index: 100;
                bottom: 0;
                right: 0;
            }

            .hidden{
                visibility: hidden;
                opacity: 0;
            }

            .toast{
                box-sizing: content-box;
                display: flex;
                box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
                border-radius: 8px;
                animation-duration: 0.5s;
                animation-name: fadeInUp;
                width: 21rem;
                min-height: 2.7rem;
                color: var(--textColor);
                margin-top: 0.5rem;
            }

            .toast-body{
                display: flex;
                flex-grow: 1;
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
                height: 2rem;
                fill: var(--secondary-text-color);
                cursor: pointer;
            }

            .warning{
                background-color: var(--error-accent-color);
            }

            .message{
                background-color: var(--main-accent-color);
            }

            @keyframes fadeInUp{
                0%{
                    opacity:0;
                    -webkit-transform:translate3d(0,100%,0);
                    transform:translate3d(0,100%,0);
                }
                to{
                    opacity:1;
                    -webkit-transform:translateZ(0);
                    transform:translateZ(0);
                }
            }
      
       `]
    }

    private static CLOSE_BUTTON: string = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>`
}

export function ShowToast(message: string) {
    const toast = document.querySelector('toast-box') as Toast;
    if (toast === null) throw new Error("Toast not found. Add toast module to index.html file.");
    toast.show(message);
}

export function ShowWarningToast(message: string) {
    const toast = document.querySelector('toast-box') as Toast;
    if (toast === null) throw new Error("Toast not found. Add toast module to index.html file.");
    toast.show(message, "warning");
}
