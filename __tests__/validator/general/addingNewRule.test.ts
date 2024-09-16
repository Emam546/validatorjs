import ValidatorClass, { MessagesStore } from "@/index";
import { hasOwnProperty } from "@/utils/compare";
import { isString } from "@/utils/types";
import { checkRules } from "@/parseRules";
declare global {
  namespace Validator {
    interface AvailableRules {
      role: {
        type: string;
        path: { role: string };
        errors: MessagesStore<{ role: string }>;
      };
    }
  }
}
ValidatorClass.register(
  "role",
  (value): value is { role: string } => {
    return hasOwnProperty(value, "role") && isString(value.role);
  },
  (teacherId, data) => {
    if (!isString(teacherId)) return "the userId is not a string";
  },
  {}
);

describe("test check rules", () => {
  describe("check rules", () => {
    test("existed role", () => {
      expect(
        checkRules({
          val: ["string", "array"],
        })
      ).toBe(true);
    });
    test("added role", () => {
      expect(
        checkRules({
          val: [{ role: "teacher" }],
        })
      ).toBe(true);
    });
  });
  test("check rules result false", () => {
    expect(
      checkRules({
        val: [{ unknownRole: "teacher" }],
      })
    ).toBe(false);
  });
});
