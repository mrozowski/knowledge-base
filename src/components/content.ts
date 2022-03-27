import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './start/start'
import './contact'
import './about-me'
import './start/issue-details'
import './create-issue/create-issue'
import { Datasource } from '../model/datasource';
import { Issue } from '../model/issue';
import { SearchOption } from './start/search-option';

@customElement('content-page')
export class Page extends LitElement {

  @property({ type: Number })
  readonly page: Pages = Pages.MAIN;

  @property({ type: Object })
  datasource!: Datasource;

  @property({ type: Object })
  issue!: Issue;

  @property()
  showIssueDetails: any

  @property()
  showStartPage: any

  @property()
  searchText: any

  @property()
  searchOption: any

  showDetails = (details: Issue) => {
    this.issue = details;
    this.showIssueDetails();
  }

  createSearchOption(): SearchOption {
    let search = SearchOption.from(this.searchOption);
    search.title = this.searchText;
    return search;
  }

  render() {

    if (this.page === Pages.DETAILS) {
      return html`<issue-details .datasource=${this.datasource} .issue=${this.issue} .goBack=${this.showStartPage}></issue-details>`;
    }
    else if (this.page === Pages.CREATOR) {
      return html`<create-issue .datasource=${this.datasource} .goBack=${this.showStartPage}></create-issue>`;
    }
    else {
      return html`<start-page .datasource=${this.datasource} .showDetails=${this.showDetails} .searchOption=${this.createSearchOption()}></start-page>`;
    }
  }
}

export enum Pages {
  MAIN,
  DETAILS,
  CREATOR
}