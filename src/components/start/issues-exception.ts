export class NoMoreIssuesHasBeenFound extends Error {
    public constructor() {
        super()
        Object.setPrototypeOf(this, NoMoreIssuesHasBeenFound.prototype);
    }
}

// Add more exception here if nessecary