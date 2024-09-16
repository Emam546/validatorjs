import ValidatorClass, { MessagesStore } from "@/index";
import { isString } from "@/utils/types";
declare global {
  namespace Validator {
    interface AvailableRules {
      asyncRole: {
        type: string;
        path: "asyncRole";
        errors: MessagesStore<{ role: string }>;
      };
    }
  }
}
ValidatorClass.register<"asyncRole">(
  "asyncRole",
  "asyncRole",
  (val, data) => {
    return new Promise((res) => {
      setTimeout(() => {
        if (!isString(val)) res("the val is not a string");
        res(undefined);
      }, 300);
    });
  },
  {}
);

describe("check async roles", () => {
  test("test basic roles", async () => {
    const validator = new ValidatorClass({ val: ["asyncRole"] });
    expect(await validator.asyncGetErrors({ val: "str" })).toStrictEqual({});
  });
  test("test gives error roles", async () => {
    const validator = new ValidatorClass({ val: ["asyncRole"] });
    expect(await validator.asyncGetErrors({ val: 1235 })).toStrictEqual({
      val: [{ message: "the val is not a string", value: 1235 }],
    });
  });
});
