import ValidatorClass from "@/index";
import { InvalidPath, UnMatchedType } from "@/utils/inValidAttr";
import { ValueNotExist } from "@/Rules/required";
import { Messages } from "@/Rules/require_if";
import { Messages as RequireWithoutMessages } from "@/Rules/require_without";

describe("required method", () => {
  test("regular Test", () => {
    const validator = new ValidatorClass({
      email: ["required"],
      password: ["required"],
    });
    expect(
      validator.getErrors({
        email: null,
      })
    ).toStrictEqual({
      password: [
        {
          message: ValueNotExist[ValidatorClass.lang],
          value: undefined,
        },
      ],
    });
    expect(
      validator.getErrors({
        email: null,
        password: null,
      })
    ).toStrictEqual({});
  });
  test("array objects", () => {
    const validator = new ValidatorClass({
      users: [{ email: ["required"], password: ["required"] }],
    });
    expect(
      validator.getErrors({
        users: [
          { email: "g@g", password: "123" },
          { email: "g@g", password: "123" },
        ],
      })
    ).toStrictEqual({});
    expect(
      validator.getErrors({
        users: [{ email: "g@g", password: "123" }, { email: "g@g" }],
      })
    ).toStrictEqual({
      "users.*1.password": [
        {
          message: "the input value is not exist",
          value: undefined,
        },
      ],
    });
    expect(
      validator.getErrors({ users: [{ email: "g@g", password: "123" }] })
    ).toStrictEqual({});
    expect(validator.getErrors({ users: [] })).toStrictEqual({});
    expect(validator.getErrors({})).toStrictEqual({});
    expect(
      validator.getErrors({
        email: "Email",
        password: "password",
      })
    ).toStrictEqual({
      email: [
        {
          message: "invalid path",
          value: "Email",
        },
      ],
      password: [
        {
          message: "invalid path",
          value: "password",
        },
      ],
    });
  });
  test("using null objects", () => {
    const validator = new ValidatorClass({
      email: ["required"],
      password: ["required"],
    });
    expect(validator.getErrors({ email: null, password: null })).toStrictEqual(
      {}
    );
  });
  test("test if the object its self is undefined", () => {
    const validator = new ValidatorClass({
      email: ["required"],
      password: ["required"],
    });
    expect(validator.getErrors(undefined)).toStrictEqual({});
  });
});
describe("required if method", () => {
  test("regular Test", () => {
    const validator = new ValidatorClass({
      password: [
        {
          required_if: {
            path: "name",
            value: "admin",
          },
        },
      ],
      name: null,
    });
    expect(
      validator.getErrors({
        name: "admin",
        password: "1234",
      })
    ).toStrictEqual({});
    expect(validator.getErrors({ name: "admin" })).toStrictEqual({
      password: [
        {
          message: Messages[ValidatorClass.lang],
          value: undefined,
        },
      ],
    });
    expect(validator.getErrors({ name: "not admin" })).toStrictEqual({});
    expect(validator.getErrors({})).toStrictEqual({});
  });
  test("array objects", () => {
    const validator = new ValidatorClass({
      users: [
        {
          password: [{ required_if: { path: "name", value: "admin" } }],
          name: null,
        },
      ],
    });
    expect(
      validator.getErrors({ users: [{ password: "123", name: "admin" }] })
    ).toStrictEqual({});
    expect(validator.getErrors({ users: [{ name: "admin" }] })).toStrictEqual({
      "users.*0.password": [
        {
          message: "the input value is not equal the another value",
          value: undefined,
        },
      ],
    });
    expect(
      validator.getErrors({ users: [{ name: "not admin" }] })
    ).toStrictEqual({});
    expect(
      validator.getErrors({
        users: [{ password: "123" }, { password: "123", name: "admin" }],
      })
    ).toStrictEqual({});
    expect(
      validator.getErrors({
        users: [{ password: "123" }, { password: "123", name: "not admin" }],
      })
    ).toStrictEqual({});
  });
  test("objects", () => {
    const validator = new ValidatorClass({
      users: [
        {
          password: [{ required_if: { path: "name", value: "admin" } }],
          name: null,
        },
        "object",
      ],
    });
    expect(
      validator.getErrors({ users: [{ password: "123", name: "admin" }] })
    ).toStrictEqual({
      users: [
        {
          message: UnMatchedType[ValidatorClass.lang],
          value: [
            {
              name: "admin",
              password: "123",
            },
          ],
        },
      ],
    });
    expect(
      validator.getErrors({
        users: {
          1: { password: "123", name: "admin" },
          2: { password: "3424", name: "admin" },
        },
      })
    ).toStrictEqual({});
    expect(
      validator.getErrors({
        users: {
          1: { password: "123", name: "admin" },
          2: { name: "not admin" },
        },
      })
    ).toStrictEqual({});
    expect(
      validator.getErrors({
        users: {
          1: { password: "123", name: "admin" },
          2: { name: "admin" },
        },
      })
    ).toStrictEqual({
      "users.2.password": [
        {
          message: "the input value is not equal the another value",
          value: undefined,
        },
      ],
    });
  });
});
describe("required without method", () => {
  test("regular method", () => {
    const validator = new ValidatorClass({
      email: [
        {
          required_without: ["name", "phone"],
        },
      ],
      name: null,
      phone: null,
    });
    expect(validator.getErrors({ email: "123@g.com" })).toStrictEqual({});
    expect(validator.getErrors({ name: "ali", phone: "123" })).toStrictEqual(
      {}
    );
    expect(validator.getErrors({ name: "ali" })).toStrictEqual({
      email: [
        {
          message: RequireWithoutMessages[ValidatorClass.lang],
          value: undefined,
        },
      ],
    });
    expect(validator.getErrors({})).toStrictEqual({
      email: [
        {
          message: RequireWithoutMessages[ValidatorClass.lang],
          value: undefined,
        },
      ],
    });
    expect(validator.getErrors({ email: "123", phone: "123" })).toStrictEqual(
      {}
    );
  });
  test("array object", () => {
    const validator = new ValidatorClass({
      users: [
        {
          name: null,
          phone: null,
          email: [{ required_without: ["name", "phone"] }],
        },
      ],
    });
    expect(
      validator.getErrors({
        users: [
          { email: "123@g.com" },
          { name: "ali", phone: "123" },
          { name: "ali" },
        ],
      })
    ).toStrictEqual({
      "users.*2.email": [
        {
          message: "the input value is not exist",
          value: undefined,
        },
      ],
    });
    expect(
      validator.getErrors({ users: [{ email: "123@g.com" }] })
    ).toStrictEqual({});
    expect(
      validator.getErrors({ users: [{ name: "ali", phone: "123" }] })
    ).toStrictEqual({});
    expect(
      validator.getErrors({ users: [{ name: "ali", phone: "123" }, {}] })
    ).not.toStrictEqual({});
    expect(validator.getErrors({ users: [{ name: "ali" }] })).toStrictEqual({
      "users.*0.email": [
        {
          message: RequireWithoutMessages[ValidatorClass.lang],
          value: undefined,
        },
      ],
    });
    expect(validator.getErrors({ users: [{}] })).toStrictEqual({
      "users.*0.email": [
        { message: "the input value is not exist", value: undefined },
      ],
    });
    expect(validator.getErrors({ users: [] })).toStrictEqual({});
    expect(
      validator.getErrors({
        users: { 1: { email: "123", phone: "123" } },
      })
    ).not.toStrictEqual({});
    expect(validator.getErrors({})).toStrictEqual({});
  });
});
