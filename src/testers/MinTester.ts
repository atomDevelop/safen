
import * as types from "../types"

export default class MinTexter implements types.Tester {

  private min: string

  constructor(min: string) {
    this.min = min
  }

  public test(data: any): boolean {
    return data >= this.min
  }
}
