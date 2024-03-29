require("@babel/polyfill");
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
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
import './pages/menu';

@customElement('main-module')
export class Main extends Controller {

  //private home: Home = new Home();
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
      // Display only login page
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
      `;
  }
}