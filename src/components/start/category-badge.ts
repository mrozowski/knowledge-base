import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Category } from './category';

@customElement('category-badge')
export class CategoryBadge extends LitElement {

    private baseClass: string = "category-badge ";
    @property({ type: Number })
    category!: Category;

    getCategoryStyle() {
        switch (this.category) {
            case Category.Java: return "java";
            case Category.Bash: return 'bash';
            case Category.Web: return 'web';
            case Category.CSS: return 'css';
            case Category.SQL: return 'sql';
            case Category.Android: return 'android';
            case Category.Python: return 'python';
            case Category.Servers: return 'servers';
            case Category.Other: return 'others';
        }
    }

    getCategoryValue() {
        return Category[this.category];
    }

    render() {

        return html`
        <div class=${this.baseClass + this.getCategoryStyle()}>
            ${this.getCategoryValue()}
        </div>
        `
    }



    static get styles() {
        return css`
        .category-badge{
            width: 6rem;
            height: 2rem;
            color: white;
            text-align: center;
            border-radius: 0.5rem;
            line-height: 2rem;
            font-size: 1em;
        }

        .java{
            background-color: #F8981D;
        }
        `;
    }
}
