import { css, html, LitElement, PropertyDeclaration, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Datasource } from '../../model/datasource';
import { Issue } from '../../model/issue';
import { Category } from "./category";
import './issue-element'
import { NoMoreIssuesHasBeenFound } from './issues-exception';
import { SearchTitleOption } from './searchOption';


@customElement('start-page')
export class Start extends LitElement {

    static styles = css`
        .content-main{ display: flex; justify-content: center; flex-direction: column;} .issue{flex-grow: 1;}
        .load-more{color: white; text-align: center;}
        .invisible{ display: none;}
        `

    private isMoreIssues: boolean = true;

    @property({ type: Object })
    datasource!: Datasource;

    @property({ type: Array })
    issues: Issue[] = new Array();

    @property()
    showDetails: any;

    @property()
    searchOption: SearchTitleOption = SearchTitleOption.DEFAULT;

    protected firstUpdated(_changedProperties: PropertyValues<any>): void {
        const response = this.datasource.getIssues();
        response.then((result) => {
            this.issues = result;
        });
    }

    updated(_changedProperties) {
        if (_changedProperties.has('searchOption')) {
            if (this.searchOption && this.searchOption.isValid()) {
                console.log("searching");
                const response = this.datasource.search(this.searchOption);
                response.then(result => {
                    this.issues = result;
                    this.isMoreIssues = true;
                });
            }

        }
    }

    // requestUpdate(name?: PropertyKey, oldValue?: unknown, options?: PropertyDeclaration<unknown, unknown>): void {
    //     if(name && name === "searchOption"){
    //         if (oldValue != this.searchOption){
    //             this.searchOption = 
    //         }
    //     }
    // }

    loadMore = () => {
        if (this.isMoreIssues) {
            const response = this.datasource.getNextIssues();
            response.then((result) => {
                result.forEach(e => {
                    this.issues.push(e);
                })
                this.isMoreIssues = true;
                this.requestUpdate('issues');
            }).catch(e => {
                if (e instanceof NoMoreIssuesHasBeenFound) {
                    this.isMoreIssues = false;
                    this.requestUpdate('issues');
                }
            });
        }
    }


    render() {

        if (this.issues.length > 0) {
            return html`
            <div class="content-main">
                ${this.issues.map((issue) => html`<issue-element class="issue" 
                .category=${Category[issue.category]}
                    .title=${issue.title} 
                    .author=${issue.author} 
                    .createdAt=${issue.createdAt}
                    .description=${issue.description}
                    .tags=${issue.tags} 
                    .id=${issue.id} 
                    .views=${issue.views}
                    .isPublic=${issue.isPublic} 
                    @click=${() => this.showDetails(issue)}>
                </issue-element>`)}

                <div class="load-more" @click=${this.loadMore}>${this.isMoreIssues ? "Load more" : "No more documents found."}</div>
            </div>
            `;
        } else {
            return html`<div class="content-main"><p> Loading </p></div>`;
        }

    }
}