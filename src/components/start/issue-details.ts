import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Issue } from '../../model/issue';
import { Category } from './category';
import "./category-badge"
import { ButtonType } from '../button';

@customElement('issue-details')
export class IssueDetails extends LitElement {

    @property()
    issue!: Issue;

    render() {

        return html`
        <div class="issue-card-details">
            <section>
                <button-x type=${ButtonType.small} .text=${"Back"} @click=${() => console.log("pam pam")}></button-x>
                <category-badge .category=${Category[this.issue.category]}></category-badge>
            </section>
        
            <h3 class="title">${this.issue.title}</h3>
        </div>
        `
    }

    static get styles() {
        return css`
        .issue-card-details{
            min-width: 35rem;
            max-width: 50rem;
            
            background-color: #363636;
            color: white;
            margin: 0.5rem auto;
            padding: 0.5rem;
            border-radius: 0.5rem;
            box-shadow: -2px -2px 6px 2px rgba(162, 162, 162, 0.30), 2px 2px 6px 2px rgba(0, 0, 0, 0.25);
        }
        section{
            display: flex;
            justify-content: space-between;
        }
        `;
    }
}

