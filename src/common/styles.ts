import { css, LitElement } from 'lit';

export class Styles extends LitElement {

    public static VARIABLES = css`
         :host{
             /* new design variables */
            --main-accent-color: #4C367E;
            --card-background: #2a2730;

            --textColor: #d4dae0;
            --headerTextColor: white;
            --secondaryTextColor: rgba(255, 255, 255, 0.6);
            --gray: #313233;
            --accentGray: #3f4041;

            /* markdown */
            --mutedTextColor: #8b949e;
            --linkAccent: #58a6ff;
            --color-neutral-muted: rgba(110,118,129,0.4);
            --color-canvas-subtle: rgba(55, 55, 55, 0.4);
        }
        `;

    public static CARD = css`
        .card{
            background-color: var(--card-background);
            min-height: 10rem;
            border-radius: 8px;
        }
    `
}
