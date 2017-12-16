
import * as types from "./types"

export class InvalidValueError extends Error {
  private listOfReasons: types.ValidatingErrors
  private messageLoader: types.MessageLoader

  constructor(reasons: types.ValidatingErrors, messageLoader: types.MessageLoader) {
    super()
    this.listOfReasons = reasons
    this.messageLoader = messageLoader
  }

  /**
   * @deprecated use reasons()
   */
  public getErrors(): types.ValidatingErrors {
    return this.listOfReasons
  }

  public errors(): string[] {
    return []
  }

  public reasons(): string[] {
    return this.listOfReasons
  }

  public messages(): string[] {
    return this.listOfReasons.map(reason => this.messageLoader.load(reason))
  }
}
