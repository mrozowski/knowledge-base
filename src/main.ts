require("@babel/polyfill");
import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Config } from './config/configuration';
import './components/menu';
import './components/content';

@customElement('main-module')
export class Main extends LitElement {

  static styles = css`
  p { color: blue }
  `;

  @property()
  name = 'Somebody';

  @property({ type: Number })
  page: number = 1;

  showStartPage = () => {
    console.log("start page");
    this.page = 1;
  }

  showLoginPage = () => {
    console.log("Go to login");
    this.page = 3;
  }

  addIssue = () => {
    console.log("Add a new issue");
  }

  searchIssue = (text: string) => {
    console.log("Searching issue: " + text);
  }


  render() {
    return html`
    <top-menu .showStartPage=${this.showStartPage} .searchIssue=${this.searchIssue} .showLoginPage=${this.showLoginPage}
      .addIssue=${this.addIssue}>
    </top-menu>
    <content-page .pageNumber=${this.page} .datasource=${Config.getDatasource()}></content-page>
      `;
  }
}