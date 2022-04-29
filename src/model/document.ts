export class Document {
    constructor(
        readonly author: string,
        readonly authorId: string,
        readonly category: string,
        readonly createdAt: Date,
        readonly modifiedAt: Date,
        readonly title: string,
        readonly tags: string[],
        readonly views: number,
        readonly id: string,
        readonly content: string,
        readonly description: string,
        readonly isPublic: boolean
    ) { }
}