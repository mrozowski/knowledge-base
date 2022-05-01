import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Styles } from './styles';


@customElement("spinner-box")
export class Spinner extends LitElement {

    render() {
        return html`
        <div class="spinner-border">
            <span class="visually-hidden">Loading...</span>
        </div>
        `
    }

    static get styles() {
        return [
            Styles.VARIABLES,
            css`
            .spinner-border {
                display: inline-block;
                width: 2rem;
                height: 2rem;
                color: var(--textColor);
                vertical-align: -0.125em;
                border: 0.25em solid currentColor;
                border-right-color: transparent;
                border-radius: 50%;
                -webkit-animation: .75s linear infinite spinner-border;
                animation: .75s linear infinite spinner-border;
            }

            .visually-hidden, .visually-hidden-focusable:not(:focus):not(:focus-within) {
                position: absolute!important;
                width: 1px!important;
                height: 1px!important;
                padding: 0!important;
                margin: -1px!important;
                overflow: hidden!important;
                clip: rect(0,0,0,0)!important;
                white-space: nowrap!important;
                border: 0!important;
            }

            @keyframes spinner-border {
                to { transform: rotate(360deg) }
            }
            
       `]
    }

}
