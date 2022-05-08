export class NoMoreDocsHasBeenFound extends Error {
    public constructor() {
        super()
        Object.setPrototypeOf(this, NoMoreDocsHasBeenFound.prototype);
    }
}

export class DocumentNotFoundError extends Error {
    public constructor(id: string) {
        super("Document with id: " + id + "has not been found.")
        Object.setPrototypeOf(this, DocumentNotFoundError.prototype);
    }
}
