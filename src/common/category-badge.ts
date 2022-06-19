import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Styles } from './styles';
import { Category } from '../model/category';

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
            case Category.Devops: return 'devops';
            case Category.Other: return 'others';
            default: return 'default';
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
        return [Styles.VARIABLES, css`
        .category-badge{
            width: 6rem;
            height: 2rem;
            color: white;
            text-align: center;
            border-radius: 0.5rem;
            line-height: 2rem;
            font-size: 1em;
            user-select: none;
        }

        @media (max-width: 768px){
            .category-badge{
                width: 5rem;
                height: 1.8rem;
                line-height: 1.8rem;
                font-size: 0.9em;
            }
        }

        .java{
            background-color: var(--category-java);
        }
        .sql{
            background-color: var(--category-sql);
        }
        .css{
            background-color: var(--category-css);
        }
        .python{
            background-color: var(--category-python);
        }
        .bash{
            background-color: var(--category-bash);
        }
        .web{
            background-color: var(--category-web);
        }
        .android{
            background-color: var(--category-android);
        }
        .devops{
            background-color: var(--category-servers);
        }
        .ai{
            background-color: var(--category-ai);
        }
        .others{
            background-color: var(--category-other);
        }
        .default{
            background-color: gray;
        }
        `];
    }
}
