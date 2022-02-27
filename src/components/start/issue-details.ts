import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Category } from './category';
import "./category-badge"

@customElement('issue-details')
export class IssueElement extends LitElement {

    @property()
    author!: string;

    render() {

        return html`
        <div class="issue-card-details">
        
        
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
            
        }
        `;
    }
}

