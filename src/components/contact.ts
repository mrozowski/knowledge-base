import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('contact-page')
export class Contact extends LitElement {

    render() {
        return html`<h2>Contact page</h2>`
    }
}