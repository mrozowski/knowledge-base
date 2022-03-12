import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './start/start'
import './contact'
import './about-me'
import './start/issue-details'
import { Datasource } from '../model/datasource';
import { Issue } from '../model/issue';

@customElement('content-page')
export class Page extends LitElement {
  // static styles = css`
  //   :host {

  //   }
  // `;

  @property({ type: Number })
  pageNumber: number = 1;

  @property({ type: Object })
  datasource!: Datasource;

  @property()
  issue!: Issue;

  showIssueDetails = (details: Issue) => {
    this.issue = details;
    this.pageNumber = 2;
  }

  showStartPage = () => {
    this.pageNumber = 1;
  }


  render() {

    if (this.pageNumber == 1) {
      return html`<start-page .datasource=${this.datasource} .showDetails=${this.showIssueDetails}></start-page>`;
    } else if (this.pageNumber == 2) {
      return html`<issue-details .datasource=${this.datasource} .issue=${this.issue} .goBack=${this.showStartPage}></issue-details>`;
    }
    else if (this.pageNumber == 3) {
      return html`<contact-page></contact-page>`;
    }
    return;
  }
}