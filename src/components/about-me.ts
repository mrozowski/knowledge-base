import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('about-page')
export class About extends LitElement {

    render() {
        return html`<h2>About me page</h2>`
    }
}