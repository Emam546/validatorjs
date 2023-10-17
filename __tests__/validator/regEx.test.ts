import Validator from "@/index";
import { Messages } from "@/Rules/regExp";
describe("test regEx", () => {
    test("simple string", () => {
        const validator = new Validator({ val: [{ regExp: /^(myWord)$/gi }] });
        expect(validator.getErrors({ val: "myWord" })).toStrictEqual({});
        expect(validator.getErrors({ val: "string" })).toStrictEqual({
            val: [
                {
                    message: Messages[Validator.lang],
                    value: "string",
                },
            ],
        });
        expect(validator.getErrors({ val: " myWord" })).toStrictEqual({
            val: [
                {
                    message: Messages[Validator.lang],
                    value: " myWord",
                },
            ],
        });
        expect(validator.getErrors({ val: "myWord " })).toStrictEqual({
            val: [
                {
                    message: Messages[Validator.lang],
                    value: "myWord ",
                },
            ],
        });
    });
});
