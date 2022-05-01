import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Styles } from '../../common/styles';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { Datasource } from '../../model/datasource';
import { Document } from '../../model/document';
import { Category } from "../../model/category";
import { NoMoreDocsHasBeenFound } from './document-exception';
import { Icons } from '../../common/icons';
import { LinkTo, PathVariable, Properties } from '../../system/router';
import { Pages } from '../../page-definition';
import './document-element'
import '../../common/spinner'
import KDatasource from '../../config/configuration';

@customElement('home-page')
export class Home extends LitElement {

    private isMoreIssues: boolean = true;

    @property({ type: Array })
    documents: Document[] = new Array();

    @property()
    searchOption: any;

    protected firstUpdated(_changedProperties: PropertyValues<any>): void {
        const response = KDatasource.getIssues();
        response.then((result) => {
            this.documents = result;
        });
    }

    updated(_changedProperties) {
        if (_changedProperties.has('searchOption')) {
            const old = _changedProperties.get('searchOption');
            if (old && old != this.searchOption) {
                const response = KDatasource.search(this.searchOption);
                response.then(result => {
                    this.documents = result;
                    this.isMoreIssues = true;
                })
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
    }

    loadMore = () => {
        if (this.isMoreIssues) {
            const response = KDatasource.getNextIssues(this.searchOption);
            response.then((result) => {
                result.forEach(e => {
                    this.documents.push(e);


                })
                if (KDatasource.getPageSize() > result.length) {
                    this.isMoreIssues = false;
                } else {
                    this.isMoreIssues = true;
                }
                this.requestUpdate('documents');
            }).catch(e => {
                if (e instanceof NoMoreDocsHasBeenFound) {
                    this.isMoreIssues = false;
                    this.requestUpdate('documents');
                }
            });
        }
    }


    render() {
        console.log("home render");
        if (this.documents.length > 0) {
            return html`
            <div class="content-main">
                ${this.documents.map((document) => html`<issue-element class="issue" 
                    .category=${Category[document.category]}
                    .title=${document.title} 
                    .author=${document.author} 
                    .createdAt=${document.createdAt}
                    .description=${document.description}
                    .tags=${document.tags} 
                    .id=${document.id} 
                    .views=${document.views}
                    .isPublic=${document.isPublic} 
                    .click=${() => LinkTo(Pages.DOCUMENT, PathVariable.create(document.id), Properties.create("document", document).add("id", document.id))}>
                </issue-element>`)}

                <div class="${this.isMoreIssues ? "cursor " : ""} load-more " @click=${this.loadMore}>
                ${this.isMoreIssues ? "Load more" : "No more documents found."}
                    <p class=${this.isMoreIssues ? "" : "invisible"}>${unsafeHTML(Icons.arrowDown)}</p>
                </div>
            </div>
            `;
        } else {
            return html`
            <section class="spinner">
                <spinner-box></spinner-box>
            </section>`;
        }

    }

    static get styles() {
        return [Styles.VARIABLES, Styles.SPINNER, css`
        
        .content-main{ display: flex; justify-content: center; flex-direction: column; padding: 0 1rem;} 
        .load-more{color: var(--secondary-text-color); text-align: center;  display: flex; flex-direction: column; align-items: center; margin: 1rem auto;  transition: all 0.5s ease-out}
        .load-more:hover > p > svg { fill: var(--textColor); }
        .load-more > p {width: 3rem;}
        .load-more > p > svg {fill: var(--tertiary--text-color); transition: all 0.5s ease-out}
        .cursor {cursor: pointer;}
        .invisible{ visibility: hidden}
        .issue{flex-grow: 1;}
        `]
    }
}