import ValidatorClass from "@/index";
import { NotValidDate } from "@/Rules/date";
class G {
  constructor() {}
}
describe("isDate", () => {
  test("undefined values", () => {
    const validator = new ValidatorClass({
      val: ["isDate"],
    });
    expect(validator.getErrors({ val: null })).toStrictEqual({
      val: [
        {
          message: NotValidDate[ValidatorClass.lang],
          value: null,
        },
      ],
    });
    expect(validator.getErrors({ val: undefined })).toStrictEqual({
      val: [
        {
          message: NotValidDate[ValidatorClass.lang],
          value: undefined,
        },
      ],
    });
    expect(validator.getErrors({ val: {} })).toStrictEqual({
      val: [
        {
          message: NotValidDate[ValidatorClass.lang],
          value: {},
        },
      ],
    });
    expect(validator.getErrors({ val: new Object() })).toStrictEqual({
      val: [
        {
          message: NotValidDate[ValidatorClass.lang],
          value: new Object(),
        },
      ],
    });
    expect(
      validator.getErrors(JSON.parse(JSON.stringify({ val: new Date() })))
    ).toStrictEqual({});
  });
});
