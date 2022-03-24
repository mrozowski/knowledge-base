import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Category } from './category';
import "./category-badge"

@customElement('issue-element')
export class IssueElement extends LitElement {

    @property()
    author!: string;

    @property()
    title!: string;

    @property()
    createdAt!: Date;

    @property({ type: Array })
    tags!: string[];

    @property({ type: Number })
    views!: number;

    @property()
    id!: string;

    @property()
    description!: string;

    @property({ type: Boolean })
    isPublic!: boolean;

    @property({ type: Number })
    category!: Category;

    @property()
    click: any;

    render() {

        return html`
        <div class="issue-card" @click=${this.click}>
            <section>
                <h3 class="title">${this.title}</h3>
                <p class="issue-date">${this.createdAt.toLocaleDateString()}</p>
            </section>
            <p class="issue-content"></p>
            <section>
                <category-badge class="cat" .category=${this.category}></category-badge>
        
            </section>
        
        
        
        </div>
        `
    }



    static get styles() {
        return css`
        .issue-card{
            min-width: 35rem;
            max-width: 50rem;
            
            background-color: rgba(255, 255, 255, 0.06);
            color: white;
            margin: 0.5rem auto;
            padding: 0.5rem;
            border-radius: 0.5rem;
            box-shadow: -2px -2px 6px 2px rgba(255, 255, 255, 0.1), 2px 2px 6px 2px rgba(0, 0, 0, 0.25);
            transition: all ease 500ms;
        }

        .issue-card:hover{
            background-color: #3f3f3f;
            cursor: pointer;
            box-shadow: -3px -3px 6px 4px rgba(70,70,70, 1), 4px 4px 6px 4px rgba(0, 0, 0, 0.50);
        }

        section{
            display: flex;
            justify-content: space-between;
        }
        .title{
            margin: 0;
            margin-top: 0.5rem;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .issue-date{
            margin: 0;
        }

        .issue-content{
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .cat{
            margin-left: auto;
        }
        `;
    }
}

