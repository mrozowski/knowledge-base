import { css, LitElement } from 'lit';

export class Styles extends LitElement {

    public static VARIABLES = css`
         :host{
             /* new design variables */
            --main-accent-color: #4C367E;
            --error-accent-color: #70367e;
            --light-accent-color: #62499D;
            --popup-background: #2a2730;
            --card-background: rgba(255, 255, 255, 0.05);
            --card-background-lighter: rgba(255, 255, 255, 0.08);
            --shade-color: rgba(0, 0, 0, 0.25);

            /* Categories color */
            --category-ai: #3F49A6;
            --category-android: #799A34;
            --category-bash: #793DA8;
            --category-css: #4094A7;
            --category-java: #A5813C;
            --category-python: #0F887A;
            --category-other: #A74C40;
            --category-servers: #98389A;
            --category-sql: #5B40A7;
            --category-web: #A63F64;

            --textColor: #d4dae0;
            --headerTextColor: white;
            --secondary-text-color: rgba(255, 255, 255, 0.6);
            --tertiary--text-color: rgba(255, 255, 255, 0.4);
            --gray: #313233;
            --accentGray: #3f4041;

            /* markdown */
            --mutedTextColor: #8b949e;
            --linkAccent: #58a6ff;
            --color-neutral-muted: rgba(110,118,129,0.4);
            --color-canvas-subtle: rgba(55, 55, 55, 0.4);
        }
        `;

    public static POPUP_CARD = css`
        .popup-card{
            background-color: var(--popup-background);
            min-height: 10rem;
            border-radius: 8px;
        }
    `

    public static CARD = css`
        .card{
            background-color: var(--card-background);
            box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
            border-radius: 8px;
            padding: 1rem;
        }
    `

    public static LARGE_CARD = [Styles.CARD, css`
        .card{
            padding: 0;
            max-width: 70rem;
            color: var(--textColor);
            margin: 0.5rem auto;
        }
    `]

    public static SPINNER = css`
    .spinner{ margin-top: 8rem; display: flex; justify-content: center; padding: 1rem;}
    `
}
