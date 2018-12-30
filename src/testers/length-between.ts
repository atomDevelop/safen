import { Tester } from "../interfaces/common"


export const lengthBetweenTester: Tester = {
  template(value, params) {
    return `(${value}.length && ${value}.length >= ${params[0]} && ${value}.length <= ${params[1]})`
  },
}
