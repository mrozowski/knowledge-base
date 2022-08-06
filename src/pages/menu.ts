import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { Icons } from '../common/icons';
import { ButtonType } from "../common/button"
import '../common/popup/popup-filter';
import { FilterPopup } from '../common/popup/popup-filter';
import { Styles } from '../common/styles';
import { LinkTo } from '../system/router';
import { Pages } from '../page-definition';

@customElement('top-menu')
export class TopMenu extends LitElement {

  @property({ type: Boolean })
  isLoggedIn: boolean = false;

  @property()
  searchIssue?: any;

  @property()
  filterIssues: any;

  @property()
  logout: any

  @property({ type: Boolean })
  searchBoxOpen: boolean = false;

  private isMobile: Boolean = false;

  pressedKey = (e: KeyboardEvent) => {
   
    
    if (e.code != undefined) {
      if (e.code === "Enter") {
        const titleInput: HTMLInputElement = this.shadowRoot!.querySelector("#top-menu-search-bar-mobile") as HTMLInputElement;
        if (titleInput != null) this.searchMobile();
        else this.search();
      }
    } else if (e.keyCode != undefined) {
      if (e.keyCode == 13) {
        const titleInput: HTMLInputElement = this.shadowRoot!.querySelector("#top-menu-search-bar-mobile") as HTMLInputElement;
        if (titleInput != null) this.searchMobile();
        else this.search();
      }
    }
  }

  private search(){
    const titleInput: HTMLInputElement = this.shadowRoot!.querySelector("#top-menu-search-bar") as HTMLInputElement;
    const title = titleInput.value.toLowerCase();
    this.searchIssue(title);
  }

  private searchMobile(){
    const titleInput: HTMLInputElement = this.shadowRoot!.querySelector("#top-menu-search-bar-mobile") as HTMLInputElement;
    const title = titleInput.value.toLowerCase();
    this.searchIssue(title);
  }

  private openFilterBox = () => {
    const popupBox = this.shadowRoot?.querySelector('popup-filter') as FilterPopup;
    popupBox.clickAction = this.filterIssues;
    popupBox.open = true;
  }

  private openMobileSearchBox = () => {
    this.searchBoxOpen = !this.searchBoxOpen;
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
        <input @keydown=${this.pressedKey} id="top-menu-search-bar" type="text" class="searchTerm" placeholder="What do you need today?">
        <div class="searchButton" @click=${this.search}>
            <div> ${unsafeHTML(Icons.search)} </div>
        </div>
      </div>
    </div>
    `
  }

  mobileSearchBar() {
    if (!this.searchBoxOpen) { return null; }
    return html`
    <div class="mobile-search">
      <div class="bar-wrap-mobile">
        <div class="search">
          <div class="mobile-search-button" @click=${this.searchMobile}>
              <div> ${unsafeHTML(Icons.search)} </div>
          </div>
          <input @keydown=${this.pressedKey} id="top-menu-search-bar-mobile" type="text" class="searchTerm" placeholder="What do you need today?">
        </div>
      </div>
    </div>
    `
  }

  mobileButtons() {
    return html`
    <div class="mobile-buttons-section">
        <button-x 
          class="mobile-btn"
          .type=${ButtonType.LARGE} 
          .text=${html`${unsafeHTML(Icons.filter)}`}  
          @click=${this.openFilterBox}  
          title="filter">
        </button-x>

        <button-x 
          class="mobile-btn"
          .type=${ButtonType.LARGE} 
          .text=${html`${unsafeHTML(Icons.search)}`}  
          @click=${this.openMobileSearchBox}  
          title="search">
        </button-x>
    </div>
    `
  }



  loginButton() {
    if (this.isLoggedIn) {
      return html`<button-x @click=${() => this.logout()} text="Logout"></button-x>`
    } else {
      return html`<button-x @click=${() => LinkTo(Pages.LOGIN)} text="Login"></button-x>`
    }
  }

  render() {
    return html`
     <popup-filter></popup-filter> 
    <nav>
      <div class="menu">
        <div class="logo">${unsafeHTML(Icons.logo)}</div>

        <div class="search-large">${this.searchBar()}</div>
        <div class="button-section">
          ${this.mobileButtons()}
          <button-x @click=${() => LinkTo(Pages.EDITOR)} text="Create" .type=${ButtonType.STANDARD} class="button-create ${this.isLoggedIn ? "" : "hidden"}"></button-x>
          ${this.loginButton()}
        </div>
        
      </div>
      ${this.mobileSearchBar()}
    </nav>   
    `;
  }

  static get styles() {
    return [Styles.VARIABLES, css`
    nav {
      width: 100%;
      height: 4rem;
      background-color: var(--main-accent-color);
      margin-bottom: 1rem;
      z-index: 100;
    }

    .menu {
      display: flex;
      height: 100%;
      align-items: center;      
      justify-content: space-between;
    }

    .mobile-search, .mobile-buttons-section{
      display: none;
    }

    .logo{
      margin-left: 0.5rem;
    }

    .logo > svg{
      width: 2.8em;
      fill: var(--secondary-text-color);
      padding-top: 5px;
    }


    .button-section{
      display: flex;
    }

    .search {
      display: flex;
      justify-content: center;
    }

    .searchTerm {
      width: 24rem;
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

    .searchButton > div{
      height: 1.5rem;
      width: 1.6rem;
      fill: var(--secondary-text-color);
    }

    .searchButton:hover{
      -webkit-filter: brightness(120%);
      filter: brightness(120%);
    }

    .bar-wrap{
      min-width: 24rem;
      margin-left: 2rem;
    }

    .hidden {
      visibility: hidden;
    }

    @media (max-width: 768px){
        nav { height: unset; transition: all 0.5s ease-out;}
        .search-large{ display: none; }
        .logo > svg{ width: 2.3em; }
        .bar-wrap-mobile{ width: 100%; }
        .button-create{ display: none; }
        .searchTerm{ max-width: 25rem; width: 60%; margin-left: 0; border-radius: 0px 5px 5px 0px; font-size: 1rem; }
        .mobile-buttons-section{ display: flex; }
        .mobile-btn{ margin: 0 1rem;}
        .mobile-search{
          display: flex;
          height: 3.4rem;
          background-color: var(--light-accent-color);
          align-items: center;
          z-index: 90;
        }
        .mobile-search-button{
          display: flex;
          padding-left: 0.5rem;
          align-items: center;
          border-radius: 5px 0px 0px 5px;
          background-color: var(--shade-color);
        }
        .mobile-search-button > div{
          height: 1.5rem;
          width: 1.6rem;
          fill: var(--tertiary--text-color);
        }
    }
    `]
  }
}