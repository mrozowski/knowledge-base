export class SearchTitleOption {
    constructor(
        readonly title: string,
        readonly category?: string[],
        readonly tags?: string[],
        readonly orderBy?: OrderByFields,
        readonly orderByDirection?: OrderByDirection
    ) { }

    static DEFAULT = new SearchTitleOption("");

    static searchByTitle(title: string) {
        return new SearchTitleOption(title);
    }

    isValid(): boolean {
        return this.title.trim().length > 1;
    }
}

export enum OrderByFields {
    Date,
    Popularity
}

export enum OrderByDirection {
    ASC,
    DESC
}

