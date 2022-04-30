require("@babel/polyfill");
import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './pages/menu';
import { SearchOption } from './model/search-option';
import { Controller } from './system/controller';
import { PageModule } from './system/page';
import { Home } from './pages/home/home';
import { Editor } from './pages/editor/editor';
import { Pages } from './page-definition';
import { DocumentDetails } from './pages/document/document-details';
import Router from './system/router';
import { Login } from './pages/login/login';
import KDatasource from './config/configuration';
import './common/toast/toast'

@customElement('main-module')
export class Main extends Controller {

  constructor() {
    super();
    //this.setDefault404Page(Pages.NOT_FOUND);
    this.setDefaultPage(Pages.HOME);
    this.enableHashRouting();
    this.setPathPrefix("/knowledge-base");
  }

  @property()
  searchTitle: string = "";

  @property()
  searchOption: SearchOption = SearchOption.DEFAULT;

  searchIssue = (text: string) => {
    console.log("Searching issue: " + text);
    this.searchTitle = text;
  }

  filterIssues = (options: SearchOption) => {
    this.searchOption = options;
    this.requestUpdate("searchOption");
  }

  private setHome(): Home {
    const home: Home = new Home();
    this.searchOption.title = this.searchTitle;
    let search = SearchOption.from(this.searchOption);
    home.searchOption = search;
    return home;
  }

  private logout = () => {
    KDatasource.logout()
      .then(() => {
        this.requestUpdate();
      });
  }

  render() {

    if (Router.isActive(Pages.LOGIN)) {
      return PageModule(new Login(), Pages.LOGIN);
    }

    return html`
    <top-menu 
      .isLoggedIn=${KDatasource.isLogin()}
      .logout=${this.logout}
      .searchIssue=${this.searchIssue} 
      .filterIssues=${this.filterIssues}>
    </top-menu>
    ${PageModule(this.setHome(), Pages.HOME)}
    ${PageModule(new Editor(), Pages.EDITOR)}
    ${PageModule(new DocumentDetails(), Pages.DOCUMENT)}

    <toast-box></toast-box>
      `;
  }
}