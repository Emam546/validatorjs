import Validator from "@/index";
import { ValueNotExist, ValuesNotSame } from "@/Rules/confirm";
describe("Confirm method", () => {
    test("Main methods", () => {
        const validator = new Validator({
            password: ["confirm", "string"],
            password_confirmation: null,
        });
        expect(
            validator.getErrors({
                password: "1234",
                password_confirmation: "1234",
            })
        ).toStrictEqual({});
        expect(
            validator.getErrors({
                password: "1234",
                password_confirmation: "123",
            })
        ).toStrictEqual({
            password: [
                {
                    message: ValuesNotSame[validator.lang],
                    value: "1234",
                },
            ],
        });
        expect(
            validator.getErrors({
                password: "1234",
                password_confirmation: 1234,
            })
        ).toStrictEqual({
            password: [
                {
                    message: ValuesNotSame[validator.lang],
                    value: "1234",
                },
            ],
        });
        expect(validator.getErrors({ password: "1234" })).toStrictEqual({
            password: [
                {
                    message: ValueNotExist[validator.lang],
                    value: "1234",
                },
            ],
        });
    });
    test("Complex objects", () => {
        const validator = new Validator({
            admin: {
                email: ["confirm", "string"],
                password: ["confirm", "string"],
                email_confirmation: null,
                password_confirmation: null,
            },
            locations: ["array", "confirm"],
            locations_confirmation: null,
            friends: [{ email: ["confirm"] }, "object"],
        });
        expect(
            validator.getErrors({
                admin: {
                    email: "sss",
                    email_confirmation: "sss",
                },
            })
        ).toStrictEqual({});
        expect(
            validator.getErrors({
                admin: {
                    email: "sss",
                    email_confirmation: "sss",
                    password: "sss",
                },
            })
        ).toStrictEqual({
            "admin.password": [
                {
                    message: ValueNotExist[validator.lang],
                    value: "sss",
                },
            ],
        });
        expect(
            validator.getErrors({
                admin: {
                    email: "sss",
                    email_confirmation: "sss",
                    password: "sss",
                    password_confirmation: "sss",
                },
            })
        ).toStrictEqual({});
        expect(
            validator.getErrors({
                admin: {
                    email: "sss",
                    email_confirmation: "sss",
                    password: "sss",
                    password_confirmation: "sss",
                },
                locations: [123, 123],
                locations_confirmation: [123, 123],
            })
        ).toStrictEqual({});
    });
    test("array method", () => {
        const validator = new Validator({
            relatives: [
                { email: ["confirm"], email_confirmation: null },
                "array",
            ],
        });
        expect(validator.getErrors({ relatives: [] })).toStrictEqual({});
        expect(
            validator.getErrors({
                relatives: [{ email: "111", email_confirmation: "111" }],
            })
        ).toStrictEqual({});
        expect(
            validator.getErrors({
                relatives: [
                    { email: "111", email_confirmation: "111" },
                    { email: "222", email_confirmation: "222" },
                ],
            })
        ).toStrictEqual({});
        expect(
            validator.getErrors({
                relatives: [
                    { email: "111", email_confirmation: "111" },
                    { email: "222" },
                ],
            })
        ).toStrictEqual({
            "relatives.*1.email": [
                {
                    message: ValueNotExist[validator.lang],
                    value: "222",
                },
            ],
        });
        expect(
            validator.getErrors({
                relatives: [{ email: "111", email_confirmation: "112" }],
            })
        ).toStrictEqual({
            "relatives.*0.email": [
                {
                    message: ValuesNotSame[validator.lang],
                    value: "111",
                },
            ],
        });
    });
});
