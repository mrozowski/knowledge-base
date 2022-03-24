import { html, LitElement, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { Icons } from '../common/icons';
import { ButtonType } from "./button"
import './popup/popup-filter';
import "./add-button"
import { FilterPopup } from './popup/popup-filter';



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
    <div class="wrap">
      <div class="search">
        <input @change=${(e: any) => this.setSearchText(e)} @keydown=${this.pressedKey} value=${this.searchText} type="text" class="searchTerm" placeholder="What are you looking for?">
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
        <span>It's top menu</span>
        <button-x .type=${ButtonType.small} .text=${html`${unsafeHTML(Icons.filter)}`}  @click=${this.openFilterBox}  title="filter"></button-x>
               
        ${this.searchBar()}
        <add-button @click=${() => this.addIssue()} class=${this.isLoggedIn ? "" : "hidden"}></add-button>
        <button-x @click=${this.showLoginPage} text="Login" .type=${ButtonType.standard}></button-x>
      </div>
    </nav>

   
    `;
  }


  static get styles() {
    return css`
    nav {
      width: 100%;
      height: 5rem;
      background-color: rgba(255, 255, 255, 0.06);
      margin-bottom: 1.5rem;
    }
    .menu {
      display: flex;
      height: 100%;
      align-items: center;
      padding: 0 2rem;
      
    }

    button {
      height: 2rem;
      margin-left: 0.4rem;
    }

    .search {
      width: 100%;
      position: relative;
      display: flex;
    }

    .searchTerm {
      width: 100%;
      border-right: none;
      padding: 5px;
      height: 2rem;
      border: none;
      border-radius: 5px 0 0 5px;
      outline: none;
      
      color: #afafaf;
    }

    .searchTerm:focus{
      color: black;
    }

    .searchButton {
      display: flex;
      width: 3rem;
      height: 2.6rem;
      border: none;
      background: linear-gradient(180deg, #1DDEF8 0%, #4780C2 100%);
      color: #fff;
      border-radius: 0 5px 5px 0;
      cursor: pointer;
      align-items: center;
      justify-content: center;
    }

    .wrap{
      margin-right: auto;
      margin-left: auto;
      padding-left: 10%;
      width: 30%;
      min-width: 23.5rem;
    }
    .hidden {
      visibility: hidden;
    }
    `
  }
}