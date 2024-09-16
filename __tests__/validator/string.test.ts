import ValidatorClass from "@/index";
import { Messages } from "@/Rules/string";
test("test string method", () => {
  const Rules = {
    val: "string",
  };
  const validator = new ValidatorClass(Rules);
  expect(validator.getErrors({ val: "my string" })).toStrictEqual({});
  expect(validator.getErrors({ val: new String("string") })).toStrictEqual({});
  expect(validator.getErrors({ val: "1234" })).toStrictEqual({});
  expect(validator.getErrors({ val: 1234 })).toStrictEqual({
    val: [
      {
        value: 1234,
        message: Messages[ValidatorClass.lang],
      },
    ],
  });
  expect(validator.getErrors({ val: null })).toStrictEqual({
    val: [
      {
        value: null,
        message: Messages[ValidatorClass.lang],
      },
    ],
  });
});
