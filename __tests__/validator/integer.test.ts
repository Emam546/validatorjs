import Validator from "@/index";
import { Messages } from "@/Rules/int";
test("test integer method", () => {
    const Rules = {
        val: "integer",
    };
    const validator = new Validator(Rules);
    expect(validator.getErrors({ val: +"10" })).toStrictEqual({});
    expect(validator.getErrors({ val: new Number(1234) })).toStrictEqual({});
    expect(validator.getErrors({ val: NaN })).toStrictEqual({
        val: [
            {
                message: Messages[validator.lang],
                value: NaN,
            },
        ],
    });
    expect(validator.getErrors({ val: "10" })).toStrictEqual({
        val: [
            {
                message: Messages[validator.lang],
                value: "10",
            },
        ],
    });
    expect(validator.getErrors({ val: null })).toStrictEqual({
        val: [
            {
                message: Messages[validator.lang],
                value: null,
            },
        ],
    });
});
