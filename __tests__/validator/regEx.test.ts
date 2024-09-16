import ValidatorClass from "@/index";
import { Messages } from "@/Rules/regExp";
describe("test regEx", () => {
  test("simple string", () => {
    const validator = new ValidatorClass({ val: [{ regExp: /^(myWord)$/gi }] });
    expect(validator.getErrors({ val: "myWord" })).toStrictEqual({});
    expect(validator.getErrors({ val: "string" })).toStrictEqual({
      val: [
        {
          message: Messages[ValidatorClass.lang],
          value: "string",
        },
      ],
    });
    expect(validator.getErrors({ val: " myWord" })).toStrictEqual({
      val: [
        {
          message: Messages[ValidatorClass.lang],
          value: " myWord",
        },
      ],
    });
    expect(validator.getErrors({ val: "myWord " })).toStrictEqual({
      val: [
        {
          message: Messages[ValidatorClass.lang],
          value: "myWord ",
        },
      ],
    });
  });
});
