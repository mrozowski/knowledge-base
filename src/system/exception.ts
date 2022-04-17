export class VariableNotFoundInPathError extends Error {
    public constructor() {
        super()
        Object.setPrototypeOf(this, VariableNotFoundInPathError.prototype);
    }
}

export class PathVariableNotSpecifiedError extends Error {
    public constructor(path: string) {
        super("Path: '" + path + "' has parameter that was not specified.\n"
            + "Please use PathVariable.create() in LinkTo method to set the parameter.")
        Object.setPrototypeOf(this, PathVariableNotSpecifiedError.prototype);
    }
}