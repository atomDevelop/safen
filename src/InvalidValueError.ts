
import * as types from "./types"

export class InvalidValueError extends Error {
    private errors: types.ValidatingErrors

    constructor(errors: types.ValidatingErrors) {
      super()
      this.errors = errors
    }

    public getErrors(): types.ValidatingErrors {
        return this.errors
    }
}
