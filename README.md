# Safen

[![Build](https://img.shields.io/travis/corgidisco/safen.svg)](https://travis-ci.org/corgidisco/safen)
[![Downloads](https://img.shields.io/npm/dt/safen.svg)](https://npmcharts.com/compare/safen?minimal=true)
[![Version](https://img.shields.io/npm/v/safen.svg)](https://www.npmjs.com/package/safen)
[![License](https://img.shields.io/npm/l/safen.svg)](https://www.npmjs.com/package/safen)

[![dependencies Status](https://david-dm.org/corgidisco/safen/status.svg)](https://david-dm.org/corgidisco/safen)
[![devDependencies Status](https://david-dm.org/corgidisco/safen/dev-status.svg)](https://david-dm.org/corgidisco/safen?type=dev)

[![NPM](https://nodei.co/npm/safen.png)](https://www.npmjs.com/package/safen)

Super Fast Object Validator for Javascript(& Typescript).

Safen supports the syntax similar to the type script interface. This makes it easy to create validation rules.

- [How to use](#how-to-use)
  - [Setup](#setup)
  - [`validate` method](#validate-method)
  - [`assert` method](#assert-method)
- [Syntax](#syntax)
  - [Type Syntax](#type-syntax)
  - [Object Syntax](#object-syntax)
    - [Optional field](#optional-field)
    - [Nested object](#nested-object)
  - [Array Syntax](#array-syntax)
    - [Fixed size array](#fixed-size-array)
    - [Array with minimum size](#array-with-minimum-size)
    - [Array with maximum size](#array-with-maximum-size)
    - [Sized array](#sized-array)
    - [Nested array](#nested-array)
- [Custom Tester](#custom-tester)
- [Custom Error Messages](#custom-error-messages)
- [Support Validators](#support-validators)
  - [Type Validations](#type-validations)
  - [Other Validations](#other-validations)
- [Comparison](#comparison)
  - [Compare with JSON Schema](#compare-with-json-schema)
  - [Compare with JOI](#compare-with-joi)
- [How Safen works](#how-safen-works)
- [Examples](#examples)
- [License](#license)

## 1.x

Please check [this link](https://github.com/corgidisco/safen/tree/1.x) for the 1.x version of the README.

## How to use

### Setup

install,

```bash
npm install safen --save
```

import,

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

There are two method in `Safen`, named `validate`, `assert`. `validate` is return boolean, `assert` occure Exception.

### validate method

```typescript
const validator = safen.sfl<string | null>`(string & email & length_between(12, 100)) | null`

// typescript with Generic
if (validator.validate(data)) {
  // now data is string!
}

validator.validate("corgidisco@gmail.com") // return true
validator.validate(null) // return true

validator.validate("corgidisco") // return false, it is not email!
```

### assert method

```typescript
const validator = safen.sfl`(string & email & length_between(12, 100)) | null`

validator.assert("corgidisco@gmail.com") // nothing happens
validator.assert(null) // nothing happens

validator.assert("corgidisco") // safen.InvalidValudError occured!
```

## Syntax

### Type Syntax

You can easily set the validation by supporting the `and`, `or` syntax.

```typescript
const validator = safen.sfl`{
  username: (string & email & length_between(12, 100)) | null,
}`

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

### Object Syntax

#### Optional field

The optional grammar is available through the "?" character. You can allow no key value in the object, or undefined.

```typescript
const validator = safen.sfl`{
  username: string & length_between(4, 20),
  password?: length_between(8, 20),
}`

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

#### Nested object

Objects in objects are also easy to use. In addition, the error message makes it easy to check the error path.

```typescript
const validator = safen.sfl`{
  username: string & length_between(4, 20),
  areas: {
    lat: number & between(-90, 90),
    lng: number & between(-180, 180),
  },
}`

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


### Array Syntax

#### Simple array

```typescript
const validator = safen.sfl`{
  areas: {
    lat: number,
    lng: number,
  }[],
}`

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

#### Fixed size array

```typescript
const validator = safen.sfl`{
  areas: {
    lat: number,
    lng: number,
  }[2],
}`

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

#### Array with minimum size

```typescript
const validator = safen.sfl`{
  areas: {
    lat: number,
    lng: number,
  }[1:],
}`

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

#### Array with maximum size

```typescript
const validator = safen.sfl`{
  areas: {
    lat: number,
    lng: number,
  }[:2],
}`

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

#### Sized array

```typescript
const validator = safen.sfl`{
  areas: {
    lat: number,
    lng: number,
  }[1:2],
}`

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

#### Nested array

```typescript
const validator = safen.sfl`{
  areas: {
    lat: number,
    lng: number,
  }[][],
}`

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


## Support Validators

### Type Validations

Validator                 | Description
------------------------- | -----------
**bool**                  | check if it is a `boolean`(alias to `boolean`).
**boolean**               | check if it is a `boolean`.
**false**                 | check if it is a `false`.
**float**                 | check if it is a `float`(alias to `number`).
**int**                   | check if it is a `integer`(alias to `integer`).
**integer**               | check if it is a `integer`.
**number**                | check if it is a `number`.
**null**                  | check if it is a `null`.
**object**                | check if it is a `object`.
**string**                | check if it is a `string`.
**symbol**                | check if it is a `symbol`.
**true**                  | check if it is a `true`.

### Other Validations

Validator                 | Description | Example
------------------------- | ----------- | ------- |
**afte({date = now})**     | check if the `string` is a date that's after the specified date. | `after`, `after("2017-10-01")`, `after("2017-10-01 14:30:00")`
**alpha**                 | check if the `string` contains only letters([a-zA-Z]). | `alpha`
**alphanum**              | check if the `string` contains only letters and numbers([a-zA-Z0-9]) | `alphanum`
**always_false**          | return always false, for debugging. | `always_false`
**always_true**           | return always true, for debugging. | `always_true`
**any**                   | return always true. | `any`
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

## Comparison

If you have used another library, please refer to the following.

```sfl
{
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
}
```

### Compare with JSON Schema

<details>
  <summary>Show JSON Schema Source</summary>

```json
{
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "username",
    "areas",
    "env"
  ],
  "properties": {
    "username": {
      "type": ["string", "null"],
      "format": "email",
      "minLength": 12,
      "maxLength": 100
    },
    "password": {
      "type": "string",
      "minLength": 8,
      "maxLength": 20
    },
    "areas": {
      "type": ["array", "null"],
      "items": {
        "type": "object",
        "required": [
          "lat",
          "lng"
        ],
        "properties": {
          "lat": {
            "type": "integer",
            "minimum": -90,
            "maximum": 90
          },
          "lng": {
            "type": "integer",
            "minimum": -180,
            "maximum": 180
          }
        }
      }
    },
    "env": {
      "type": "object",
      "required": [
        "referer",
        "ip",
        "os",
        "browser"
      ],
      "properties": {
        "referer": {
          "type": "string",
          "format": "uri"
        },
        "ip": {
          "type": "string",
          "format": "ipv4"
        },
        "os": {
          "type": "object",
          "required": [
            "name",
            "version"
          ],
          "properties": {
            "name": {
              "type": "string",
              "enum": ["window", "osx", "android", "iphone"],
            },
            "version": {
              "type": "string",
              "pattern": "^(.*)$"
            }
          }
        },
        "browser": {
          "type": "object",
          "required": [
            "name",
            "version"
          ],
          "properties": {
            "name": {
              "type": "string",
              "enum": ["chrome", "firefox", "edge", "ie"],
            },
            "version": {
              "type": "string",
              "pattern": "^(.*)$"
            }
          }
        }
      }
    }
  }
}
```

</details>

### Compare with JOI

[JOI](https://github.com/hapijs/joi) is the most popular object schema validation library.

<details>
  <summary>Show JOI Source</summary>

```js
Joi.object().keys({
  username: Joi.string().required().allow(null).email().min(12).max(100),
  password: Joi.string().min(8).max(20),
  areas: Joi.array().required().allow(null).min(1).items(Joi.object().keys({
    lat: Joi.number().required().min(-90).max(90),
    lng: Joi.number().required().min(-180).max(180),
  })),
  env: Joi.object().required().keys({
    referer: Joi.string().uri().required(),
    ip: Joi.string().required().ip({version: ["ipv4"]}),
    os: Joi.object().required().keys({
      name: Joi.any().required().only("window", "osx", "android", "iphone"),
      version: Joi.string().required(),
    }),
    browser: Joi.object().required().keys({
      name: Joi.any().required().only("chrome", "firefox", "edge", "ie"),
      version: Joi.string().required(),
    }),
  }),
})
```

</details>

## How Safen works

Safen parses the grammar and internally generates an AST similar to the Json Schema.

```sfl
{
  username: (string & email) | null,
  areas: {
    lat?: number & between(-90, 90),
    lng?: number & between(-180, 180),
  }[1]
}
```

The generated AST is as follows:

<details>
  <summary>Show AST</summary>

```json
{
  "type": "object",
  "properties": {
    "username": {
      "optional": false,
      "value": {
        "type": "or",
        "params": [
          {
            "type": "and",
            "params": [
              {
                "type": "scalar",
                "name": "string",
                "params": []
              },
              {
                "type": "scalar",
                "name": "email",
                "params": []
              }
            ]
          },
          {
            "type": "scalar",
            "name": "null",
            "params": []
          }
        ]
      }
    },
    "areas": {
      "optional": false,
      "value": {
        "type": "array",
        "min": 1,
        "max": 1,
        "value": {
          "type": "object",
          "properties": {
            "lat": {
              "optional": true,
              "value": {
                "type": "and",
                "params": [
                  {
                    "type": "scalar",
                    "name": "number",
                    "params": []
                  },
                  {
                    "type": "scalar",
                    "name": "between",
                    "params": [
                      -90,
                      90
                    ]
                  }
                ]
              }
            },
            "lng": {
              "optional": true,
              "value": {
                "type": "and",
                "params": [
                  {
                    "type": "scalar",
                    "name": "number",
                    "params": []
                  },
                  {
                    "type": "scalar",
                    "name": "between",
                    "params": [
                      -180,
                      180
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    }
  }
}
```

</details>

It then generates validate and assert functions based on AST.
And, it is very fast because it generates native functions. The `validate` function is generated as follows:

```js
function(v) {
  return (function() {
    if (typeof v !== "object" || v === null) {
      return false
    }
    if (typeof v.username === "undefined") {
      return false
    }
    if (!((((typeof(v.username) === "string") && /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v.username)) || v.username === null))) {
      return false
    }
    if (typeof v.areas === "undefined") {
      return false
    }
    if (!((function() {
        if (!Array.isArray(v.areas) || v.areas.length < 1 || v.areas.length > 1) {
          return false
        }
        for (var t0 = 0; t0 < v.areas.length; t0++) {
          if (!((function() {
              if (typeof v.areas[t0] !== "object" || v.areas[t0] === null) {
                return false
              }
              if (typeof v.areas[t0].lat !== "undefined") {
                if (!(((typeof(v.areas[t0].lat) === "number") && (v.areas[t0].lat >= -90 && v.areas[t0].lat <= 90)))) {
                  return false
                }
              }
              if (typeof v.areas[t0].lng !== "undefined") {
                if (!(((typeof(v.areas[t0].lng) === "number") && (v.areas[t0].lng >= -180 && v.areas[t0].lng <= 180)))) {
                  return false
                }
              };
              return true
            })())) {
            return false
          }
        }
        return true
      })())) {
      return false
    };
    return true
  })()
}
```

The assert function also creates a native function like this. You can see the code generated by the following code.

```js
console.log(create("{..}").assert.toString())
```

## Examples

- [with express](./examples/with-express)

## License

MIT
