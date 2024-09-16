import ValidatorClass from "@/index";
import { MinError } from "@/Rules/minMax";
describe("min max", () => {
  test("number", () => {
    const validator = new ValidatorClass({
      val: [{ min: 0 }],
    });
    expect(validator.getErrors({ val: -1 })).toStrictEqual({
      val: [
        {
          message: MinError[ValidatorClass.lang],
          value: -1,
        },
      ],
    });
    expect(validator.getErrors({ val: 0 })).toStrictEqual({});
    expect(validator.getErrors({ val: 1 })).toStrictEqual({});
  });
});
