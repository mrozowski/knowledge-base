import { css, CSSResult, html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators";
import { Styles } from "../../common/styles";
import { Category } from "../start/category";
import { DateFilter, DateOption, OrderBy, SearchOption } from "../start/search-option";
import { Popup } from "./popup";

@customElement("popup-filter")
export class FilterPopup extends Popup {

    private categories: string[] = [];

    firstUpdated() {
        for (let item in Category) {
            if (isNaN(Number(item))) {
                this.categories.push(item);
            }
        }
    }

    getSelectedCategories(): string[] {
        let result: string[] = [];
        let category: NodeListOf<HTMLLabelElement> = this.shadowRoot!.querySelectorAll(".category-label") as NodeListOf<HTMLLabelElement>;
        category.forEach(label => {
            let checkbox: HTMLInputElement = label.childNodes[1] as HTMLInputElement;
            if (checkbox.checked) {
                result.push(checkbox.name);
            }
        });
        return result;
    }

    getSelectedDate(): Date | undefined {
        let date: HTMLInputElement = this.shadowRoot!.querySelector("#date-input-filter") as HTMLInputElement;
        const value: string = date.value;
        if (value.length > 1) {
            return new Date(value);
        }
        return undefined;
    }

    getSelectedOrder(): OrderBy {
        let order: HTMLSelectElement = this.shadowRoot!.querySelector("#order-filter") as HTMLSelectElement;
        const index: number = order.selectedIndex;
        const value: OrderBy = order.options[index].value as OrderBy;
        return value;
    }

    getSelectedTags(): string[] {
        let tags: HTMLInputElement = this.shadowRoot!.querySelector("#tag-input-filter") as HTMLInputElement;
        if (tags.value.length == 0) return [];
        return tags.value.split(/[\s,]+/);
    }


    clickOkButton(): void {
        const options: SearchOption = SearchOption.DEFAULT;
        let categories: string[] = this.getSelectedCategories();
        let tags: string[] = this.getSelectedTags();
        let date = this.getSelectedDate();
        let order = this.getSelectedOrder();


        this.getSelectedDate();
        options.categories = categories;
        options.tags = tags;
        if (date != undefined) options.date = new DateFilter(date, DateOption.OLDER);
        else options.date = undefined;
        options.order = order;

        this.clickAction(options);
        this.close();
    }


    createContent() {
        return html`
        <div class="sub-container">
            <div class="Filter">
                <span class="title">Filter</span>
            </div>
            
            <div class="Category">
                <span class="type">Category</span>
                <div id="categories-list">
                    ${this.getCategoryList()}
                </div>
            </div>
            
            <div class="date-tags">
                <span class="type">Date</span>
                <label> <span>Older than</span> <input id="date-input-filter" type="date" name="date" /></label>

                <span class="type">Tags</span>
                <label><input id="tag-input-filter" type="text" name="tags" /></label>
            </div>
            <div class="Sort">
                <span class="title">Sort</span>
            </div>
            <div class="field-direction">
                <span class="type">By</span>
                <select id="order-filter">
                    <option> Date: Newest </option>
                    <option> Date: Oldest </option>
                    <option> Title: A..Z </option>
                    <option> Title: Z..A </option>
                    <option> Popularity: Highest </option>
                </select>
            </div>
        
        </div>
        `
    }

    protected static customStyles(): CSSResult {
        return css`
        label{
            display: block;
        }

        input[type="checkbox"] {
            vertical-align: middle;
            position: relative;
        }

        .field-direction{
            border-left: gray solid 3px;
        }

        .sub-container {  
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 0.3fr 1.7fr;
            gap: 0px 0px;
            grid-auto-flow: row;
            grid-template-areas:
                "Filter Filter Sort"
                "Category date-tags field-direction";
        }

        .Filter { grid-area: Filter; }
        .Sort { grid-area: Sort; }
        .Category { grid-area: Category; }
        .field-direction { grid-area: field-direction; }
        .date-tags { grid-area: date-tags; }

        `
    }

    private getCategoryList(): TemplateResult<1> {
        return html`
        ${this.categories.map(category => html`
                <label class="category-label">
                    <input type="checkbox" name="${category}" /> ${category} 
                </label>
            `)
            }`;
    }
}

