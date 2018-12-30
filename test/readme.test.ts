
import "jest"

import * as safen from "../src"

describe("usage", () => {
  it("usage", () => {
    expect.assertions(0)

    // section:usage-default
    const validator = safen.create({
      "username": "string & email & length_between:12,100",
      "password?": "string & length_between:8,20",
      "areas[1:]": {
        lat: "number & between:-90,90",
        lng: "number & between:-180,180",
      },
      "env": {
        referer: "url",
        ip: "ip:v4",
        os: {
          name: "in:window,osx,android,iphone",
          version: "string",
        },
        browser: {
          name: "in:chrome,firefox,edge,ie",
          version: "string",
        },
      },
    })

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
    // endsection
  })
})


describe("sample pipe", () => {
  it("sample pipe", () => {
    expect.assertions(1)
    // section:sample-pipe
    const validator = safen.create({
      username: "string & email & length_between:12,100",
    })

    validator.assert({
      username: "corgidisco@gmail.com",
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
        ])
      }
    }
    // endsection
  })
})

describe("sample optional", () => {
  it("sample optional", () => {
    expect.assertions(1)
    // section:sample-optional
    const validator = safen.create({
      "username": "string & length_between:4,20",
      "password?": "length_between:8,20", // optional
    })

    validator.assert({
      username: "corgidisco",
      password: "password!@#",
    }) // ok

    validator.assert({
      username: "username",
      // undefined password is OK.
    }) // ok

    validator.assert({
      username: "username",
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
        username: "username",
        password: null, // null password is not OK
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
    // endsection
  })
})

describe("sample object in object", () => {
  it("sample object in object", () => {
    expect.assertions(0)

    // section:sample-object-in-object
    const validator = safen.create({
      username: "string & length_between:4,20",
      areas: {
        lat: "number & between:-90,90",
        lng: "number & between:-180,180",
      },
    })

    validator.assert({
      username: "corgidisco",
      areas: {
        lat: 37,
        lng: 126,
      },
    }) // ok
    // endsection
  })
})

describe("sample array", () => {
  it("sample simple array", () => {
    expect.assertions(1)

    // section:sample-simple-array
    const validator = safen.create({
      "areas[]": { // array
        lat: "number",
        lng: "number",
      },
    })

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
    // endsection
  })

  it("sample array with range, fixed", () => {
    expect.assertions(2)

    // section:sample-array-with-range-fixed
    const validator = safen.create({
      "areas[2]": { // array
        lat: "number",
        lng: "number",
      },
    })

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
    // endsection
  })

  it("sample array with range, min", () => {
    expect.assertions(1)

    // section:sample-array-with-range-min
    const validator = safen.create({
      "areas[1:]": { // array
        lat: "number",
        lng: "number",
      },
    })

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
    // endsection
  })

  it("sample array with range, max", () => {
    expect.assertions(1)

    // section:sample-array-with-range-max
    const validator = safen.create({
      "areas[:2]": { // array
        lat: "number",
        lng: "number",
      },
    })

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
    // endsection
  })

  it("sample array with range, between", () => {
    expect.assertions(2)

    // section:sample-array-with-range-between
    const validator = safen.create({
      "areas[1:2]": { // array
        lat: "number",
        lng: "number",
      },
    })

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
    // endsection
  })

  it("sample array with multi dims", () => {
    expect.assertions(1)

    // section:sample-array-with-multi-dims
    const validator = safen.create({
      "areas[][]": { // array
        lat: "number",
        lng: "number",
      },
    })

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
            path: "areas.0",
            reason: "array",
            params: [],
            message: "The areas.0 must be an array.",
          },
          {
            path: "areas.1",
            reason: "array",
            params: [],
            message: "The areas.1 must be an array.",
          },
        ])
      }
    }
    // endsection
  })


  // it("sample custom error messages", () => {
  //   expect.assertions(1)

  //   const nativeConsoleLog = console.log
  //   console.log = (error: any): void => {
  //     expect(error).toEqual([
  //       {reason: "email@username", message: "this is a custom message in username."},
  //     ])
  //   }

  //   // section:sample-custom-error-messages
  //   const validator = safen.create({
  //     username: "email",
  //   }, {
  //     messages: {
  //       email: [
  //         "this is a custom message in :attribute.", // exist `:attribute`
  //         "this is a custom message.", // no `:attribute`
  //       ],
  //     },
  //   })

  //   try {
  //     validator.assert({
  //       username: "corgidisco",
  //     }) // fail
  //   } catch (e) {
  //     if (e instanceof safen.InvalidValueError) {
  //       // output is :
  //       // [ { reason: 'email@username', message: 'this is a custom message in username.' } ]
  //       console.log(e.errors)
  //     }
  //   }
  //   // endsection

  //   console.log = nativeConsoleLog
  // })

  // it("sample custom error messages examples", () => {
  //   // section:sample-custom-error-messages-examples
  //   const messages = {
  //     required: ["The :attribute is required.", "It is required."],
  //     between: ["The :attribute must be between :arg0 and :arg1.", "It must be between :arg0 and :arg1."],
  //     in: ["The :attribute does not exist in :args.", "It does not exist in :args."],
  //   }
  //   // endsection

  //   const validator = safen.create({
  //     username: "email",
  //     foo: "between:1,2",
  //     bar: "in:a,b,c",
  //   }, {
  //     messages,
  //   })

  //   try {
  //     validator.assert({
  //       foo: 4,
  //       bar: "d",
  //     })
  //   } catch (e) {
  //     if (e instanceof safen.InvalidValueError) {
  //       expect(e.errors()).toEqual([
  //         {reason: "required@username", message: "The username is required."},
  //         {reason: "between:1,2@foo", message: "The foo must be between 1 and 2."},
  //         {reason: "in:a,b,c@bar", message: "The bar does not exist in a, b, c."},
  //       ])
  //     }
  //   }
  // })
})
