export class DateFilter {
    constructor(
        readonly date: Date,
        readonly option: DateOption) { };
}

export enum DateOption {
    OLDER,
    NEWER
}

export type OrderBy = "Date: Newest" | "Date: Oldest" | "Title: A..Z" | "Title: Z..A" | "Popularity: Highest";

export class SearchOption {

    title: string = ""
    categories: string[] = []
    date: DateFilter | undefined;
    tags: string[] = []
    order: OrderBy = "Date: Newest";

    static DEFAULT = new SearchOption();

    static from(options: SearchOption): SearchOption {
        let object = new SearchOption();
        object.categories = options.categories;
        object.tags = options.tags;
        object.title = options.title
        object.date = options.date;
        object.order = options.order;
        return object;
    }

    isTitle(): boolean {
        return this.title.length > 1;
    }

    isCategories(): boolean {
        return this.categories.length > 0;
    }

    isDate() {
        return this.date != undefined;
    }

    isTags(): boolean {
        return this.tags.length > 0;
    }

    isDefault(): boolean {
        return !this.isTitle() && !this.isCategories() && !this.isDate() && !this.isTags && this.order == "Date: Newest";
    }

}



