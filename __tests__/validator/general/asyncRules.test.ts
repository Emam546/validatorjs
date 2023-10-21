import Validator, { MessagesStore } from "@/index";
import { isString } from "@/utils/types";
declare module "@/type" {
    interface AvailableRules {
        asyncRole: {
            type: string;
            path: "asyncRole";
            errors: MessagesStore<{ role: string }>;
        };
    }
}
Validator.register<"asyncRole">(
    "asyncRole",
    "asyncRole",
    async (val, data) => {
        if (!isString(val)) return "the val is not a string";
    },
    {}
);

describe("check async roles", () => {
    test("test basic roles", async () => {
        const validator = new Validator({ val: ["asyncRole"] });
        expect(await validator.asyncGetErrors({ val: "str" })).toStrictEqual(
            {}
        );
    });
    test("test gives error roles", async () => {
        const validator = new Validator({ val: ["asyncRole"] });
        expect(await validator.asyncGetErrors({ val: 1235 })).toStrictEqual({
            val: [{ message: "the val is not a string", value: 1235 }],
        });
    });
});
