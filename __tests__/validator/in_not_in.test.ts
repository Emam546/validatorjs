import ValidatorClass from "@/index";
import { MessagesIn, MessagesNotIn } from "@/Rules/in_notIn";
describe("in && not_in methods", () => {
  test("main _in methods", () => {
    const rules = {
      name: [{ in: ["ahmed", "ali", "mohamed"] }],
    };
    const validator = new ValidatorClass(rules);
    expect(validator.getErrors({ name: "ahmed" })).toStrictEqual({});
    expect(validator.getErrors({ name: "ali" })).toStrictEqual({});
    expect(validator.getErrors({ name: "mohamed" })).toStrictEqual({});
    expect(validator.getErrors({ name: "mohamed" })).toStrictEqual({});
    expect(validator.getErrors({ name: "noName" })).toStrictEqual({
      name: [
        {
          message: MessagesIn[ValidatorClass.lang],
          value: "noName",
        },
      ],
    });
    expect(validator.getErrors({ name: "" })).toStrictEqual({
      name: [
        {
          message: MessagesIn[ValidatorClass.lang],
          value: "",
        },
      ],
    });
    expect(validator.getErrors({ name: "ahmed," })).toStrictEqual({
      name: [
        {
          message: MessagesIn[ValidatorClass.lang],
          value: "ahmed,",
        },
      ],
    });
  });
  test("main not_in methods", () => {
    const rules = {
      name: [{ not_in: ["ahmed", "ali", "mohamed"] }],
    };
    const validator = new ValidatorClass(rules);

    expect(validator.getErrors({ name: "ahmed" })).toStrictEqual({
      name: [{ message: MessagesNotIn[ValidatorClass.lang], value: "ahmed" }],
    });
    expect(validator.getErrors({ name: "ali" })).toStrictEqual({
      name: [{ message: MessagesNotIn[ValidatorClass.lang], value: "ali" }],
    });

    expect(validator.getErrors({ name: "mohamed" })).toStrictEqual({
      name: [{ message: MessagesNotIn[ValidatorClass.lang], value: "mohamed" }],
    });
    expect(validator.getErrors({ name: "noName" })).toStrictEqual({});
    expect(validator.getErrors({ name: "" })).toStrictEqual({});
    expect(validator.getErrors({ name: "ahmed," })).toStrictEqual({});
    expect(validator.getErrors({ name: "ahmed," })).toStrictEqual({});
  });
});
