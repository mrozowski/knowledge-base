import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Styles } from './styles';


@customElement("switch-box")
export class Switch extends LitElement {

    @property({ type: Boolean })
    switchState: boolean = false;

    render() {
        return html`
        <label class="switch">
            <input type="checkbox" 
                ?checked=${this.switchState} 
                @change=${() => this.switchState = !this.switchState}>
            <span class="slider round"></span>
        </label>
        `
    }

    static get styles() {
        return [
            Styles.VARIABLES,
            css`
            .switch {
                position: relative;
                display: inline-block;
                width: 3.2rem;
                height: 1.6rem;
            }

            /* Hide default HTML checkbox */
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            /* The slider */
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: var(--card-background);
                -webkit-transition: .4s;
                transition: .4s;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 1.2rem;
                width: 1.2rem;
                left: 0.2rem;
                bottom: 0.2rem;
                background-color: var(--textColor);
                -webkit-transition: .4s;
                transition: .4s;
            }

            input:checked + .slider {
                background-color: var(--main-accent-color);
            }

            input:focus + .slider {
                box-shadow: 0 0 1px var(--main-accent-color);
            }

            input:checked + .slider:before {
                -webkit-transform: translateX(26px);
                -ms-transform: translateX(26px);
                transform: translateX(26px);
            }

            .slider.round {
                border-radius: 34px;
            }

            .slider.round:before {
                border-radius: 50%;
            }
       `]
    }

}

