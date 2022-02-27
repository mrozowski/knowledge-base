import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './start/start'
import './contact'
import './about-me'
import { Datasource } from '../model/datasource';

@customElement('content-page')
export class Page extends LitElement {
  static styles = css`
    :host {
        
    }
  `;

  @property({ type: Number }) pageNumber: number = 1;

  @property({ type: Object })
  datasource!: Datasource;


  render() {
    if (this.pageNumber == 1) {
      return html`<start-page .datasource=${this.datasource}></start-page>`;
    } else if (this.pageNumber == 2) {
      return html`<about-page></about-page>`;
    }
    else if (this.pageNumber == 3) {
      return html`<contact-page></contact-page>`;
    }
    return;
  }
}