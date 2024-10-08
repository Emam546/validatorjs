import ValidatorClass from "@/index";
import { ValuesNotSame } from "@/Rules/different";
describe("different method", () => {
  test("Main methods", () => {
    const validator = new ValidatorClass({
      email: null,
      password: [{ different: "email" }, "string"],
    });
    expect(
      validator.getErrors({ password: "1234", email: "1234" })
    ).toStrictEqual({
      password: [
        {
          message: ValuesNotSame[ValidatorClass.lang],
          value: "1234",
        },
      ],
    });
    expect(
      validator.getErrors({ password: "1234", email: "123" })
    ).toStrictEqual({});
    expect(validator.getErrors({ password: "1234" })).toStrictEqual({});

    expect(
      validator.getErrors({ password: "1234", email: 1234 })
    ).toStrictEqual({});
  });
  test("Complex objects", () => {
    const validator = new ValidatorClass({
      admin: {
        email: [{ different: "password" }, "string"],
        password: ["string"],
      },
      password: null,
    });

    expect(
      validator.getErrors({
        admin: {
          email: "sss",
          password: "sss",
        },
      })
    ).toStrictEqual({
      "admin.email": [
        {
          message: ValuesNotSame[ValidatorClass.lang],
          value: "sss",
        },
      ],
    });
    expect(
      validator.getErrors({
        admin: {
          email: "sss",
          password: "another name",
        },
      })
    ).toStrictEqual({});
    expect(
      validator.getErrors({
        admin: {
          email: "sss",
        },
        password: "sss",
      })
    ).toStrictEqual({});
  });
  test("array method", () => {
    const validator = new ValidatorClass({
      relatives: [
        { email: [{ different: "password" }], password: null },
        "array",
      ],
    });
    expect(
      validator.getErrors({
        relatives: [{ email: "sss", password: "sss" }],
      })
    ).toStrictEqual({
      "relatives.*0.email": [
        {
          message: ValuesNotSame[ValidatorClass.lang],
          value: "sss",
        },
      ],
    });
    expect(
      validator.getErrors({
        relatives: [{ email: "sss", password: "ssss" }],
      })
    ).toStrictEqual({});
    expect(
      validator.getErrors({ relatives: [{ email: "sss" }] })
    ).toStrictEqual({});
    expect(
      validator.getErrors({
        relatives: [{ email: "sss" }, { password: "sss" }],
      })
    ).toStrictEqual({});
  });
});
