# Safen

[![Build](https://img.shields.io/travis/corgidisco/safen.svg)](https://travis-ci.org/corgidisco/safen)
[![Downloads](https://img.shields.io/npm/dt/safen.svg)](https://npmcharts.com/compare/safen?minimal=true)
[![Version](https://img.shields.io/npm/v/safen.svg)](https://www.npmjs.com/package/safen)
[![License](https://img.shields.io/npm/l/safen.svg)](https://www.npmjs.com/package/safen)

[![dependencies Status](https://david-dm.org/corgidisco/safen/status.svg)](https://david-dm.org/corgidisco/safen)
[![devDependencies Status](https://david-dm.org/corgidisco/safen/dev-status.svg)](https://david-dm.org/corgidisco/safen?type=dev)

[![NPM](https://nodei.co/npm/safen.png)](https://www.npmjs.com/package/safen)

Super Fast Complex Object Validator for Javascript(& Typescript).

Safen supports the syntax similar to the type script interface. This makes it easy to create complex validation rules.

## Install

```bash
npm install safen --save
```

## Usage

Import,

```js
import * as safen from "safen"
// or
const safen = require("safen")
```

then,

```typescript
const validator = safen.sfl`{
  username: (string & email & length_between(12, 100)) | null,
  password?: string & length_between(8, 20),
  areas: {
    lat: number & between(-90, 90),
    lng: number & between(-180, 180),
  }[1:] | null,
  env: {
    referer: url,
    ip: ip("v4"),
    os: {
      name: in("window", "osx", "android", "iphone"),
      version: string,
    },
    browser: {
      name: in("chrome", "firefox", "edge", "ie"),
      version: string,
    },
  },
}`

validator.assert({
  username: "corgidisco@gmail.com",
  areas: [
    {lat: 0, lng: 0},
  ],
  env: {
    referer: "http://corgidisco.github.io",
    ip: "127.0.0.1",
    os: {
      name: "osx",
      version: "10.13.1",
    },
    browser: {
      name: "chrome",
      version: "62.0.3202.94",
    },
  },
}) // ok
```

There are two method in Safen, named `validate`, `assert`. `validate` is return boolean, `assert` occure Exception.

```typescript
const validator = safen.create("(string & email & length_between(12, 100)) | null")

// validate method

expect(validator.validate("corgidisco@gmail.com")).toBeTruthy()
expect(validator.validate(null)).toBeTruthy()

expect(validator.validate("corgidisco")).toBeFalsy() // return false!!!


// assert method

validator.assert("corgidisco@gmail.com") // safe
validator.assert(null) // safe
try {
  validator.assert("corgidisco") // // not safe!
} catch (e) {
  expect(e).toBeInstanceOf(safen.InvalidValueError)
}
```


## Support Validators

### Type Validations

Validator                 | Description
------------------------- | -----------
**bool**                  | check if it is a `boolean`(alias to `boolean`).
**boolean**               | check if it is a `boolean`.
**float**                 | check if it is a `float`(alias to `number`).
**int**                   | check if it is a `integer`(alias to `integer`).
**integer**               | check if it is a `integer`.
**number**                | check if it is a `number`.
**null**                  | check if it is a `null`.
**object**                | check if it is a `object`.
**string**                | check if it is a `string`.
**symbol**                | check if it is a `symbol`.

### Other Validations

Validator                 | Description | Example
------------------------- | ----------- | ------- |
**afte({date = now})**     | check if the `string` is a date that's after the specified date. | `after`, `after("2017-10-01")`, `after("2017-10-01 14:30:00")`
**alpha**                 | check if the `string` contains only letters([a-zA-Z]). | `alpha`
**alphanum**              | check if the `string` contains only letters and numbers([a-zA-Z0-9]) | `alphanum`
**always_false**          | return always false, for debugging. | `always_false`
**always_true**           | return always true, for debugging. | `always_true`
**ascii**                 | check if the `string` contains only ascii characters. | `ascii`
**base64**                | check if the `string` is Base64. | `base64`
**before({date = now})**   | check if the `string` is a date that's before the specified date. | `before("2017-10-01")`, `before("2017-10-01 14:30:00")`
**between({min},{max})**   | check if the value(`string`, `number`) is between `{min}` and `{max}`. | `between("aaa","zzz")`, `between(1,100)`
**creditcard**            | check if the `string` is valid Credit Card number. cf. `0000-0000-0000-0000` | `creditcard`
**date**                  | check if the `string` is valid Date string(RFC2822, ISO8601). cf. `2018-12-25`, `12/25/2018`, `Dec 25, 2018` | `date`
**email**                 | check if the `string` is valid E-mail string. | `email`
**finite**                | check if the `number` is not `NaN`, `Infinity`, `-Infinity`. | `finite`
**hexcolor**              | check if the `string` is valid Hex Color string. cf. `#ffffff` | `hexcolor`
**in({...params})**        | check if the value(`any`) is in an array `{params}`. | `in(1,2,3)`, `in("safari","edge","firefox","other browser")`
**ip({version = all})**    | check if the `string` is valid UUID.<br />version is one of `all`(default), `v4`, and `v6`. | `ip`, `ip("v4")`, `ip("v6")`
**json**                  | check if the `string` is valid JSON. | `json`
**jwt**                   | check if the `string` is valid JWT. | `jwt`
**length({size})**              | check if the value(`string`)'s length is `{size}`. | `length(16)`
**length_between({min},{max})** | check if the value(`string`)'s length is between `{min}` and `{max}`. | `length_between(4,20)`
**length_max({max})**           | check if the value(`string`)'s length is less than `{max}`. | `length_max(20)`
**length_min({min})**           | check if the value(`string`)'s length is greater than `{min}`. | `length_min(4)`
**lowercase**             | check if the `string` is lowercase. | `lowercase`
**macaddress**            | check if the `string` is valid Mac Address. | `macaddress`
**max({max})**             | check if the value(`string`, `number`) is less than {min}. | `max(5)`
**min({min})**             | check if the value(`string`, `number`) is greater than {max}. | `min(3)`
**nan**                   | check if the value(`any`) is NaN. | `nan`
**re**                   | check if the value(`any`) match RegExp(alias to `regexp`). | `regexp(/.+/)`
**regex**                   | check if the value(`any`) match RegExp(alias to `regexp`). | `regexp(/.+/)`
**regexp**                   | check if the value(`any`) match RegExp. | `regexp(/.+/)`
**port**                  | check if the `string` is valid PORT(0-65535). | `port`
**uppercase**             | check if the `string` is uppercase. | `uppercase`
**url**                   | check if the `string` is valid URL. | `url`
**uuid({version = all})**  | check if the `string` is valid UUID.<br />version is one of `all`(default), `v3`, `v4`, and `v5`. | `uuid`, `uuid("v3")`, `uuid("v4")`, `uuid("v5")`


## Rule Examples

### Type Syntax

You can easily set the validation by supporting the `and`, `or` syntax.

```typescript
const validator = safen.create(`{
  username: (string & email & length_between(12, 100)) | null,
}`)

validator.assert({
  username: "corgidisco@gmail.com",
}) // ok
validator.assert({
  username: null,
}) // ok

try {
  validator.assert({
    username: "corgidisco",
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "username",
        reason: "email",
        params: [],
        message: "The username must be a valid email address.",
      },
      {
        path: "username",
        reason: "null",
        params: [],
        message: "The username must be a null.",
      },
    ])
  }
}
```

### Optional

The optional grammar is available through the "?" character. You can allow no key value in the object, or undefined.

```typescript
const validator = safen.create(`{
  username: string & length_between(4, 20),
  password?: length_between(8, 20),
}`)

validator.assert({
  username: "corgidisco",
  password: "password!@#",
}) // ok

validator.assert({
  username: "corgidisco",
  // undefined password is OK.
}) // ok

validator.assert({
  username: "corgidisco",
  password: undefined, // undefined password is also OK.
}) // ok

try {
  validator.assert({
    // undefined username is not ok.
    password: "password!@#",
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "username",
        reason: "required",
        params: [],
        message: "The username is required.",
      },
    ])
  }
}

try {
  validator.assert({
    username: "corgidisco",
    password: null, // null is not allowed
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "password",
        reason: "length",
        params: [],
        message: "The username is required.",
      },
    ])
  }
}
```

### Object in Object

Objects in objects are also easy to use. In addition, the error message makes it easy to check the error path.

```typescript
const validator = safen.create(`{
  username: string & length_between(4, 20),
  areas: {
    lat: number & between(-90, 90),
    lng: number & between(-180, 180),
  },
}`)

validator.assert({
  username: "corgidisco",
  areas: {
    lat: 37,
    lng: 126,
  },
}) // ok

try {
  validator.assert({
    username: "corgidisco",
    areas: {
      lat: "37",
      lng: 126,
    },
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas.lat",
        reason: "number",
        params: [],
        message: "The areas.lat must be a number.",
      },
    ])
  }
}

validator.assert({
  username: "corgidisco",
  areas: {
    lat: 37,
    lng: 126,
  },
}) // ok
```


### Array Support

**Simple Array**

```typescript
const validator = safen.create(`{
  areas: {
    lat: number,
    lng: number,
  }[],
}`)

validator.assert({
  areas: [], // empty is OK
}) // ok

validator.assert({
  areas: [
    {lat: 37, lng: 126},
    {lat: 31, lng: 125},
  ],
}) // ok

try {
  validator.assert({
    areas: "",
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas",
        reason: "array",
        params: [],
        message: "The areas must be an array.",
      },
    ])
  }
}
```

**Array With Range - Fixed**

```typescript
const validator = safen.create(`{
  areas: {
    lat: number,
    lng: number,
  }[2],
}`)

validator.assert({
  areas: [
    {lat: 37, lng: 126},
    {lat: 31, lng: 125},
  ],
}) // ok

try {
  validator.assert({
    areas: [
      {lat: 37, lng: 126},
      {lat: 31, lng: 125},
      {lat: 31, lng: 125},
    ],
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas",
        reason: "array_length",
        params: [2],
        message: "The areas's length must be 2.",
      },
    ])
  }
}

try {
  validator.assert({
    areas: [
      {lat: 37, lng: 126},
    ],
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas",
        reason: "array_length",
        params: [2],
        message: "The areas's length must be 2.",
      },
    ])
  }
}
```

**Array With Range - Min**

```typescript
const validator = safen.create(`{
  areas: {
    lat: number,
    lng: number,
  }[1:],
}`)

validator.assert({
  areas: [
    {lat: 31, lng: 125},
  ],
}) // ok

validator.assert({
  areas: [
    {lat: 37, lng: 126},
    {lat: 31, lng: 125},
  ],
}) // ok

try {
  validator.assert({
    areas: [],
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas",
        reason: "array_length_min",
        params: [1],
        message: "The areas's length must be at least 1.",
      },
    ])
  }
}
```

**Array With Range - Max**

```typescript
const validator = safen.create(`{
  areas: {
    lat: number,
    lng: number,
  }[:2],
}`)

validator.assert({
  areas: [
    {lat: 31, lng: 125},
  ],
}) // ok

validator.assert({
  areas: [
    {lat: 37, lng: 126},
    {lat: 31, lng: 125},
  ],
}) // ok

try {
  validator.assert({
    areas: [
      {lat: 37, lng: 126},
      {lat: 31, lng: 125},
      {lat: 32, lng: 121},
    ],
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas",
        reason: "array_length_max",
        params: [2],
        message: "The areas's length may not be greater than 2.",
      },
    ])
  }
}
```

**Array With Range - Between**

```typescript
const validator = safen.create(`{
  areas: {
    lat: number,
    lng: number,
  }[1:2],
}`)

validator.assert({
  areas: [
    {lat: 31, lng: 125},
  ],
}) // ok

validator.assert({
  areas: [
    {lat: 37, lng: 126},
    {lat: 31, lng: 125},
  ],
}) // ok

try {
  validator.assert({
    areas: [],
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas",
        reason: "array_length_between",
        params: [1, 2],
        message: "The areas's length must be between 1 and 2.",
      },
    ])
  }
}

try {
  validator.assert({
    areas: [
      {lat: 37, lng: 126},
      {lat: 31, lng: 125},
      {lat: 32, lng: 121},
    ],
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas",
        reason: "array_length_between",
        params: [1, 2],
        message: "The areas's length must be between 1 and 2.",
      },
    ])
  }
}
```

**Array with Multi Dimension**

```typescript
const validator = safen.create(`{
  areas: {
    lat: number,
    lng: number,
  }[][],
}`)

validator.assert({
  areas: [
    [
      {lat: 37, lng: 126},
      {lat: 31, lng: 125},
    ],
    [
      {lat: 37, lng: 126},
      {lat: 31, lng: 125},
    ],
  ],
}) // ok

try {
  validator.assert({
    areas: [
      {lat: 37, lng: 126},
      {lat: 31, lng: 125},
    ],
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas[0]",
        reason: "array",
        params: [],
        message: "The areas[0] must be an array.",
      },
      {
        path: "areas[1]",
        reason: "array",
        params: [],
        message: "The areas[1] must be an array.",
      },
    ])
  }
}
```


## Custom Tester

Custom tester is written in template format like below:

```typescript
const oddTester: safen.Tester = (value, params, gen) => {
  return `(Number.isInteger(${value}) && ${value} % 2 === 1)`
}

const evenTester: safen.Tester = (value, params, gen) => {
  return `(Number.isInteger(${value}) && ${value} % 2 === 0)`
}

const validation = safen.create(`{
  even: even,
  odd: odd,
}`, {
  testers: {
    odd: oddTester,
    even: evenTester,
  },
})

expect(validation.validate({even: 2, odd: 1})).toBeTruthy()

expect(validation.validate({even: 1, odd: 1})).toBeFalsy()
expect(validation.validate({even: 2, odd: 2})).toBeFalsy()
expect(validation.validate({even: 1, odd: 2})).toBeFalsy()
```

A more complex example is:

- example of `params` and `gen`: [before tester](./src/testers/before.ts)

## Custom Error Messages

If needed, you can add custom error messages.

```typescript
const validator = safen.create(`{
  username: email,
}`, {
  messages: {
    email: [
      "this is a custom error message in :path.", // exist `:path`
      "this is a custom error message.", // no `:path`
    ],
  },
})

try {
  validator.assert({
    username: "corgidisco",
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "username",
        reason: "email",
        params: [],
        message: "this is a custom error message in username.",
      },
    ])
  }
}
```

The `:attribute` will be replaced by field name. For example :

```typescript
const validator = safen.create(`{
  foo: email,
  bar: between(1, 2),
  baz: in("a", "b", "c"),
}`, {
  messages: {
    required: ["The :path is required.", "It is required."],
    between: ["The :path must be between :param0 and :param1.", "It must be between :param0 and :param1."],
    in: ["The :path does not exist in :params.", "It does not exist in :params."],
  },
})

try {
  validator.assert({
    // foo
    bar: 4,
    baz: "d",
  })
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {path: "foo", reason: "required", params: [], message: "The foo is required."},
      {path: "bar", reason: "between", params: [1, 2], message: "The bar must be between 1 and 2."},
      {path: "baz", reason: "in", params: ["a", "b", "c"], message: "The baz does not exist in [\"a\",\"b\",\"c\"]."},
    ])
  }
}
```

## License

MIT
