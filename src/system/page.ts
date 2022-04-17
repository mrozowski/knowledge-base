import { html, LitElement, TemplateResult } from "lit";
import { Pages } from "../page-definition";
import Router from "./router";

function updateComponentProperties(pageComponent: LitElement) {
    if (Router.hasProperties()) {
        const properties = Router.getProperties();
        properties.forEach((value, key) => {
            console.log(value);
            if (value instanceof String) {
                pageComponent.setAttribute(key, value as string);
            } else {
                pageComponent.setAttribute(key, JSON.stringify(value));
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

