export class Issue {
    constructor(
        readonly author: string,
        readonly category: string,
        readonly createdAt: Date,
        readonly title: string,
        readonly tags: string[],
        readonly views: number,
        readonly id: string,
        readonly description: string,
        readonly solution: Text,
        readonly isPublic: boolean
    ) { }
}