import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { Icons } from '../common/icons';
import { ButtonType } from "./button"
import './popup/popup-filter';
import "./add-button"
import { FilterPopup } from './popup/popup-filter';
import { Styles } from '../common/styles';



@customElement('top-menu')
export class TopMenu extends LitElement {

  private searchText: string = "";

  setSearchText = (e: any) => {
    this.searchText = e.target.value
  }

  @property({ type: Boolean })
  isLoggedIn: boolean = true;

  @property()
  showStartPage?: any;

  @property()
  showAboutMePage?: any;

  @property()
  showLoginPage?: any;

  @property()
  addIssue?: any;

  @property()
  searchIssue?: any;

  @property()
  filterIssues: any;

  pressedKey = (e: KeyboardEvent) => {
    // fix it later
    if (e.code != undefined) {
      if (e.code === "Enter") {
        //this.searchIssue(this.searchText);
      }
    } else if (e.keyCode != undefined) {
      if (e.keyCode == 13) {
        //this.searchIssue(this.searchText);
      }
    }
  }



  openFilterBox = () => {
    const popupBox = this.shadowRoot?.querySelector('popup-filter') as FilterPopup;
    popupBox.clickAction = this.filterIssues;
    popupBox.open = true;
  }


  searchBar() {
    return html`
    <div class="bar-wrap">
      <div class="search">
        <button-x 
          class="filter-btn"
          .type=${ButtonType.LARGE} 
          .text=${html`${unsafeHTML(Icons.filter)}`}  
          @click=${this.openFilterBox}  
          title="filter">
        </button-x>
        <input @change=${(e: any) => this.setSearchText(e)} @keydown=${this.pressedKey} value=${this.searchText} type="text" class="searchTerm" placeholder="What do you need today?">
        <div class="searchButton" @click=${() => this.searchIssue(this.searchText)} >
          <ion-icon name="search-outline" size="large"></ion-icon>
        </div>
      </div>
    </div>
    `
  }



  render() {
    return html`
     <popup-filter></popup-filter> 
    <nav>
      <div class="menu">
      <div class="logo">${unsafeHTML(Icons.logo)}</div>
      
      ${this.searchBar()}
      <div class="button-section">
        <button-x @click=${this.addIssue} text="Create" .type=${ButtonType.STANDARD} class=${this.isLoggedIn ? "" : "hidden"}></button-x>
        <button-x @click=${this.showLoginPage} text="Login" .type=${ButtonType.STANDARD}></button-x>
      </div>
      </div>
    </nav>   
    `;
  }


  static get styles() {
    return [Styles.VARIABLES, css`
    nav {
      width: 100%;
      height: 5rem;
      background-color: var(--main-accent-color);
      margin-bottom: 1rem;
    }

    .menu {
      display: flex;
      height: 100%;
      align-items: center;      
      justify-content: space-between;
    }

    .logo{
      display: flex;
      height: 100%;
      margin-left: 0.5rem;
    }

    .logo > svg{
      width: 4em;
      padding-top: 5px;
    }

    .filter-btn{
      margin: 0 2%;
    }

    .button-section{
      display: flex;
    }

    .search {
      display: flex;
    }

    .searchTerm {
      width: 25rem;
      border-right: none;
      padding: 5px 10px;
      margin-left: 1rem;
      height: 2rem;
      border: none;
      border-radius: 5px 0 0 5px;
      outline: none;
      transition: color 0.25s ease-out;
      background-color: var(--shade-color);
      color: var(--secondary-text-color)
    }

    .searchTerm:focus{
      color: var(--textColor);
    }

    .searchTerm::placeholder{
      color: var(--tertiary-text-color);
      font-weight: 100;
    }

    .searchButton {
      display: flex;
      width: 3.6rem;
      background-color: var(--light-accent-color);
      color: var(--textColor);
      border: none;
      border-radius: 0 5px 5px 0;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease-out;
    }

    .searchButton:hover{
      -webkit-filter: brightness(120%);
      filter: brightness(120%);
    }

    .bar-wrap{
      min-width: 24rem;
    }

    .hidden {
      visibility: hidden;
    }
    `]
  }
}