export class TempDocument {
    constructor(public title: string,
        public tags: string[],
        public category: string,
        public content: string,
        public isPublic: boolean) { }
}