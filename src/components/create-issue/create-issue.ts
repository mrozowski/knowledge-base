import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Datasource } from '../../model/datasource';
import './editor'


@customElement('create-issue')
export class CreateIssue extends LitElement {

    @property({ type: Object })
    datasource!: Datasource;

    storeFile = (file: Blob) => {
        console.log("storeFile");
        console.log(file);
        let ref = this.datasource.storePicture(file, "someName2.png");
        console.log(ref);

    }

    render() {
        return html`
        <div class="container">
            <div class="issue-card-creator">
                <section>
        
                </section>
        
                <edit-section .saveFileOnFly=${this.storeFile}></edit-section>
            </div>
        </div>
        `

    }

    static get styles() {
        return [css`
        .container{
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
        }
        .issue-card-creator{
            max-width: 80rem;
            background-color: rgba(255, 255, 255, 0.06);
            color: var(--textColor);
            margin: 0.5rem auto;
            padding: 16px !important;
            border-radius: 0.5rem;
            box-shadow: -2px -2px 6px 2px rgba(255, 255, 255, 0.1), 2px 2px 6px 2px rgba(0, 0, 0, 0.25);
        }
        section{
            display: flex;
            justify-content: space-between;
        }


        .created-date{
            line-height: 2.6rem;
            margin-right: 0.7rem;
        }

        @media (min-width: 768px){
            .issue-card-creator {

                padding-right: 24px !important;
                padding-left: 24px !important;
            }
        }

        @media (min-width: 1012px){
            .issue-card-creator {
                
                
                padding-right: 32px !important;
                padding-left: 32px !important;
            }
       }`]
    }
}