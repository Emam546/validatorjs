import { Equal, Expect } from "./types.test";
import Validator, { ValidTypes, AvailableRules } from "@/index";
declare global {
  namespace Validator {
    interface AvailableRules {
      existedId: {
        type: string;
        path: { existedId: { path: string } };
        errors: {};
      };
    }
  }
}
declare module "../src/index" {
  namespace Validator {
    interface AvailableRules {
      existedId: {
        type: string;
        path: "Hey";
        errors: {};
      };
    }
  }
}
describe("Test Adding Feature", () => {
  test("test", () => {
    type Test1 = Expect<
      Equal<
        ValidTypes<{
          val: [{ existedId: { path: string } }];
        }>,
        | {
            val: string | undefined;
          }
        | undefined
      >
    >;
  });
});
