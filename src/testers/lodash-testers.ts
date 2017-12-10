
import * as types from "../types"
import * as _ from "lodash"

type GeneratorHandler = (value: any) => boolean

function gen(handler: GeneratorHandler): {new(): types.Tester} {
  class AnonymousTester implements types.Tester {
    public test(data: any): boolean {
      return handler(data)
    }
  }
  return AnonymousTester
}

export const testers = {
  "lodash.isArguments": gen(_.isArguments),
  "lodash.isArray": gen(_.isArray),
  "lodash.isArrayBuffer": gen(_.isArrayBuffer),
  "lodash.isArrayLike": gen(_.isArrayLike),
  "lodash.isArrayLikeObject": gen(_.isArrayLikeObject),
  "lodash.isBoolean": gen(_.isBoolean),
  "lodash.isBuffer": gen(_.isBuffer),
  "lodash.isDate": gen(_.isDate),
  "lodash.isElement": gen(_.isElement),
  "lodash.isEmpty": gen(_.isEmpty),
  "lodash.isError": gen(_.isError),
  "lodash.isFinite": gen(_.isFinite),
  "lodash.isFunction": gen(_.isFunction),
  "lodash.isInteger": gen(_.isInteger),
  "lodash.isLength": gen(_.isLength),
  "lodash.isMap": gen(_.isMap),
  "lodash.isNaN": gen(_.isNaN),
  "lodash.isNative": gen(_.isNative),
  "lodash.isNil": gen(_.isNil),
  "lodash.isNull": gen(_.isNull),
  "lodash.isNumber": gen(_.isNumber),
  "lodash.isObject": gen(_.isObject),
  "lodash.isObjectLike": gen(_.isObjectLike),
  "lodash.isPlainObject": gen(_.isPlainObject),
  "lodash.isRegExp": gen(_.isRegExp),
  "lodash.isSafeInteger": gen(_.isSafeInteger),
  "lodash.isSet": gen(_.isSet),
  "lodash.isString": gen(_.isString),
  "lodash.isSymbol": gen(_.isSymbol),
  "lodash.isTypedArray": gen(_.isTypedArray),
  "lodash.isUndefined": gen(_.isUndefined),
  "lodash.isWeakMap": gen(_.isWeakMap),
  "lodash.isWeakSet": gen(_.isWeakSet),
}
