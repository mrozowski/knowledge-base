import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Styles } from '../../common/styles';
import { ButtonType } from '../button';


export abstract class Popup extends LitElement {

    @property({ type: Boolean })
    open: boolean;

    clickAction: any;

    constructor() {
        super();
        this.open = false;
    }

    close() {
        this.open = false;
    }

    abstract clickOkButton(): void;

    abstract createContent(): TemplateResult<1>;

    render() {
        return html`
        <div class=${this.open ? "container" : "hidden"} >
        <div class="overlay"></div>
            <div class="popup-card">
                <div class="top-bar">
                    <button-x .text=${"Cancel"} @click=${this.close} type=${ButtonType.SECONDARY}></button-x>
                    <button-x .text=${"Ok"} @click=${() => this.clickOkButton()}></button-x>
                </div>
                <div class="box-content">
                    ${this.createContent()}
                </div>
            </div>
        </div>
        `
    }

    protected static customStyles() {
        // override this method to set custom styles in child class
        return css``;
    }

    static get styles() {
        return [
            Styles.VARIABLES,
            Styles.POPUP_CARD,
            this.customStyles(),
            css`
            .container{
                transition: opacity 0.25s ease-in;
                color: var(--textColor);
                position: absolute;
                margin: 0 auto;
                width: 30rem;
                z-index: 10;
                top: 12%;
                right: 0;
                left: 0; 
            }

            .hidden{
                visibility: hidden;
                display: none;
            }

            .overlay {
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
                position: fixed;
                height: 100vh;
                width: 100vw;
                z-index: -1;
                left: 0; 
                top: 0; 
            }

            .top-bar{
                background-color: var(--main-accent-color);
                justify-content: space-between;
                border-radius: 8px 8px 0 0;
                flex-direction: row;
                display: flex;
            }

            .box-content{
                padding: 0.9rem 1rem;
            }       
       `]
    }
}