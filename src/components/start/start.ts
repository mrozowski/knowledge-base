import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Datasource } from '../../model/datasource';
import { Issue } from '../../model/issue';
import { Category } from "./category";
import './issue-element'


@customElement('start-page')
export class Start extends LitElement {

    static styles = css`.content-main{ display: flex; justify-content: center; flex-direction: column;} .issue{flex-grow: 1;}`

    @property({ type: Object })
    datasource!: Datasource;

    @property({ type: Array })
    issues: Issue[] = new Array();

    @property()
    showDetails!: any;

    protected firstUpdated(_changedProperties: PropertyValues<any>): void {
        const response = this.datasource.getIssues();
        response.then((result) => {
            this.issues = result;
        });

    }

    render() {

        if (this.issues.length > 0) {
            return html`
            <div class="content-main">
                ${this.issues.map((issue) => html`<issue-element class="issue" .category=${Category[issue.category]}
                    .title=${issue.title} .author=${issue.author} .createdAt=${issue.createdAt} .description=${issue.description}
                    .solution=${issue.solution} .tags=${issue.tags} .id=${issue.id} .views=${issue.views}
                    .isPublic=${issue.isPublic} @click=${()=> this.showDetails(issue)}>
                </issue-element>`)}
            </div>
            `;
        } else {
            return html`<p> Loading </p>`;
        }

    }
}