import { html, LitElement, TemplateResult } from "lit";
import { Pages } from "../page-definition";
import Router from "./router";

function updateComponentProperties(pageComponent: LitElement) {
    if (Router.hasProperties()) {
        const properties = Router.getProperties();
        properties.forEach((value, key) => {
            console.log(value);
            if (typeof value == 'string') {
                pageComponent.setAttribute(key, value as string);
                console.log("it is string");
            } else {
                pageComponent.setAttribute(key, JSON.stringify(value));
                console.log("it is object");

            }

        });
    }
}

export function PageModule(pageComponent: LitElement, pagePath: Pages): TemplateResult<1> | null {
    if (Router.isActive(pagePath)) {
        updateComponentProperties(pageComponent);
        return html`${pageComponent}
        `;
    }
    return null;
}

