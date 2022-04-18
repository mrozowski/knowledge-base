import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Styles } from '../../common/styles';
import { Category } from '../../model/category';
import "../../common/category-badge"

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
        <div class="card" @click=${this.click}>
            <div class="card-content">
                <div class="card-description">
                    <h3 class="title">${this.title}</h3>
                    <p class="issue-content">${this.description}</p>
                </div>
                <div class="card-info">
                    <p class="issue-date">${new Date(this.createdAt).toLocaleDateString()}</p>
                    <category-badge class="cat" .category=${this.category}></category-badge>
                </div>
            </div>
        </div>
        `
    }



    static get styles() {
        return [Styles.VARIABLES, Styles.CARD, css`
        .card{
            min-width: 35rem;
            max-width: 50rem;
            height: 9.5em;
            color: var(--textColor);
            margin: 0 auto 0.8rem;
            transition: all ease 500ms;
            cursor: pointer;
            -moz-box-sizing: border-box; 
            -webkit-box-sizing: border-box; 
            box-sizing: border-box;
            
        }

        .card:hover{
            background-color: var(--card-background-lighter);
            box-shadow: 3px 3px 4px 3px rgba(0, 0, 0, 0.30);
        }

        .card-content{
            display: flex;
            justify-content: space-between;
            height: 100%;
        }

        .card-description{
            width: 82%;
            
        }

        .card-info{
            display: flex;
            align-self: flex-end;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;

        }

        .title{
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .issue-date{
            margin: 0;
            color: var(--secondary-text-color);
            text-align: end;
        }

        .issue-content{
            text-overflow:ellipsis;
            overflow:hidden;
            display: -webkit-box !important;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            white-space: normal;
            color: var(--secondary-text-color)
        }

        `];
    }
}

