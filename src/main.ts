require("@babel/polyfill");
import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Config } from './config/configuration';
import './components/menu';
import { Pages } from './components/content';
import { SearchOption } from './components/start/search-option';

@customElement('main-module')
export class Main extends LitElement {

  static styles = css`
  p { color: blue }
  `;

  @property()
  name = 'Somebody';

  @property()
  searchTitle: string = "";

  @property()
  searchOption: SearchOption = SearchOption.DEFAULT;

  @property({ type: Number })
  page: Pages = Pages.MAIN;

  showStartPage = () => {
    this.page = Pages.MAIN;
  }

  showLoginPage = () => {
    console.log("Go to login");
    this.page = 3;
  }

  addIssue = () => {
    console.log("Add a new issue");
    this.page = Pages.CREATOR;
  }

  showIssueDetails = () => {
    this.page = Pages.DETAILS;
  }

  searchIssue = (text: string) => {
    console.log("Searching issue: " + text);
    this.searchTitle = text;
  }

  filterIssues = (options: SearchOption) => {
    console.log("search options: ");
    console.log(options);
    this.searchOption = options;
    this.requestUpdate("searchOption");
  }

  render() {
    return html`
    <top-menu 
      .showStartPage=${this.showStartPage} 
      .searchIssue=${this.searchIssue} 
      .showLoginPage=${this.showLoginPage}
      .addIssue=${this.addIssue}
      .filterIssues=${this.filterIssues}>
    </top-menu>
    <content-page 
      .page=${this.page} 
      .datasource=${Config.getDatasource()}
      .showIssueDetails=${this.showIssueDetails}
      .showStartPage=${this.showStartPage}
      .searchText=${this.searchTitle}
      .searchOption=${this.searchOption}>
    </content-page>
      `;
  }
}