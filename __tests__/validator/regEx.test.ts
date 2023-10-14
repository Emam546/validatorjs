import Validator from "@/index";
import { Messages } from "@/Rules/regExp";
describe("test regEx", () => {
    test("simple string", () => {
        const validator = new Validator({ val: [{ regExp: /^(myWord)$/gi }] });
        expect(validator.getErrors({ val: "myWord" })).toStrictEqual({});
        expect(validator.getErrors({ val: "string" })).toBe(false);
        expect(validator.getErrors({ val: " myWord" })).toBe(false);
        expect(validator.getErrors({ val: "myWord " })).toBe(false);
    });
});
