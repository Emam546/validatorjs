import Validator, { parseRules } from "@/index";
describe("test validate", () => {
    test("main", () => {
        const Rules = Validator.parseRules({
            name: "string",
        });
        const data = {
            name: "ali",
        };
        const data2 = {
            name: 123,
        };
        let valid: any = new Validator(data, Rules);
        expect(valid.CPaths).toStrictEqual({ name: ["string"] });
        expect(valid.passes()).toBe(true);
        valid = new Validator(data2, Rules);
        expect(valid.passes()).toBe(false);
    });
    test("test object describing", () => {
        const Rules = Validator.parseRules({
            person: [
                {
                    age: ["integer"],
                    friends: [["string"], "array", ["min:0", "max:10"]],
                },
                "object",
            ],
        });
        let data: any = { person: { ahmed: { friends: ["ahmed", "ali"] } } };
        let result = new Validator(data, Rules, {});
        expect(result.passes()).toBe(true);
        expect(result.errors).toStrictEqual({});
        data = {
            person: {
                ahmed: { age: 12, friends: ["ahmed", "ali", "new friend"] },
            },
        };
        expect(new Validator(data, Rules, {}).getErrors()).toBeNull();
        data = {
            person: [{ age: 12, friends: ["ahmed", "ali", "new friend"] }],
        };
        expect(new Validator(data, Rules, {}).passes()).toBe(false);
    });
    test("test with array", () => {
        const rules = parseRules({
            friendsNames: [["string"]],
        });
        const data = {
            friendsNames: ["ahmed", "ali", "osama", "said"],
        };
        expect(new Validator(data, rules).passes()).toBe(true);
        const data2 = {
            friendsNames: ["ahmed", 12, 231, "osama", "said"],
        };
        expect(new Validator(data2, rules).passes()).toBe(false);
    });
});
test("IF THE RULE EXIST", () => {
    const Rules = Validator.parseRules({
        name: "string",
    });
    const data = {
        name: "ali",
    };
    let valid = new Validator(data, Rules, {});
    expect(Validator.Rules.length).toBeGreaterThan(0);
    expect(valid.validate("name", "string", "")).toStrictEqual([]);
    expect(valid.validate(1234, "string", "")).not.toStrictEqual([]);
});
describe("Confirm method", () => {
    test("Main methods", () => {
        let Rules = Validator.parseRules({
            password: ["confirm", "string"],
        });
        expect(
            new Validator(
                { password: "1234", password_confirmation: "1234" },
                Rules,
                {}
            ).passes()
        ).toBe(true);
        expect(
            new Validator(
                { password: "1234", password_confirmation: "123" },
                Rules,
                {}
            ).passes()
        ).toBe(false);
        expect(
            new Validator(
                { password: "1234", password_confirmation: 1234 },
                Rules,
                {}
            ).passes()
        ).toBe(false);
        expect(new Validator({ password: "1234" }, Rules, {}).passes()).toBe(
            false
        );
    });
    test("Complex objects", () => {
        let Rules = Validator.parseRules({
            admin: {
                email: ["confirm", "string"],
                password: ["confirm", "string"],
            },
            locations: ["array", "confirm"],
            friends: [{ email: ["confirm"] }, "object"],
        });
        expect(
            new Validator(
                {
                    admin: {
                        email: "sss",
                        email_confirmation: "sss",
                    },
                },
                Rules,
                {}
            ).passes()
        ).toBe(true);
        expect(
            new Validator(
                {
                    admin: {
                        email: "sss",
                        email_confirmation: "sss",
                        password: "sss",
                    },
                },
                Rules,
                {}
            ).passes()
        ).toBe(false);
        expect(
            new Validator(
                {
                    admin: {
                        email: "sss",
                        email_confirmation: "sss",
                        password: "sss",
                        password_confirmation: "sss",
                    },
                },
                Rules,
                {}
            ).passes()
        ).toBe(true);
        expect(
            new Validator(
                {
                    admin: {
                        email: "sss",
                        email_confirmation: "sss",
                        password: "sss",
                        password_confirmation: "sss",
                    },
                    locations: [123, 123],
                    locations_confirmation: [123, 123],
                },
                Rules,
                {}
            ).passes()
        ).toBe(true);
    });
    test("array method", () => {
        let rules = Validator.parseRules({
            relatives: [{ email: ["confirm"] }, "array"],
        });
        expect(new Validator({ relatives: [] }, rules, {}).passes()).toBe(true);
        expect(
            new Validator(
                { relatives: [{ email: "111", email_confirmation: "111" }] },
                rules,
                {}
            ).passes()
        ).toBe(true);
        expect(
            new Validator(
                {
                    relatives: [
                        { email: "111", email_confirmation: "111" },
                        { email: "222", email_confirmation: "222" },
                    ],
                },
                rules,
                {}
            ).passes()
        ).toBe(true);
        expect(
            new Validator(
                {
                    relatives: [
                        { email: "111", email_confirmation: "111" },
                        { email: "222" },
                    ],
                },
                rules,
                {}
            ).passes()
        ).toBe(false);
        expect(
            new Validator(
                {
                    relatives: [{ email: "111", email_confirmation: "112" }],
                },
                rules,
                {}
            ).passes()
        ).toBe(false);
    });
});
describe("different method", () => {
    test("Main methods", () => {
        let Rules = Validator.parseRules({
            password: ["different:email", "string"],
        });
        expect(
            new Validator(
                { password: "1234", email: "123" },
                Rules,
                {}
            ).passes()
        ).toBe(true);
        expect(new Validator({ password: "1234" }, Rules, {}).passes()).toBe(
            true
        );
        expect(
            new Validator(
                { password: "1234", email: "1234" },
                Rules,
                {}
            ).passes()
        ).toBe(false);
        expect(
            new Validator({ password: "1234", email: 1234 }, Rules, {}).passes()
        ).toBe(true);
    });
    test("Complex objects", () => {
        let Rules = Validator.parseRules({
            admin: {
                email: ["different:password", "string"],
                password: ["string"],
            },
        });
        expect(
            new Validator(
                {
                    admin: {
                        email: "sss",
                        password: "sss",
                    },
                },
                Rules,
                {}
            ).passes()
        ).toBe(false);
        expect(
            new Validator(
                {
                    admin: {
                        email: "sss",
                        password: "another name",
                    },
                },
                Rules,
                {}
            ).passes()
        ).toBe(true);
        expect(
            new Validator(
                {
                    admin: {
                        email: "sss",
                    },
                    password: "sss",
                },
                Rules,
                {}
            ).passes()
        ).toBe(true);
        expect(
            new Validator(
                {
                    admin: {
                        email: "sss",
                        password: "another name",
                    },
                    password: "sss",
                },
                Rules,
                {}
            ).passes()
        ).toBe(true);
    });
    test("array method", () => {
        let rules = Validator.parseRules({
            relatives: [{ email: ["different:password"] }, "array"],
        });
        expect(
            new Validator(
                { relatives: [{ email: "sss", password: "sss" }] },
                rules,
                {}
            ).passes()
        ).toBe(false);
        expect(
            new Validator(
                { relatives: [{ email: "sss", password: "ssss" }] },
                rules,
                {}
            ).passes()
        ).toBe(true);
        expect(
            new Validator({ relatives: [{ email: "sss" }] }, rules, {}).passes()
        ).toBe(true);
        expect(
            new Validator(
                { relatives: [{ email: "sss" }, { password: "sss" }] },
                rules,
                {}
            ).passes()
        ).toBe(true);
    });
});
describe("in && not_in methods", () => {
    test("main _in methods", () => {
        const rules = Validator.parseRules({ name: "in:ahmed,ali,mohamed" });
        expect(new Validator({ name: "ahmed" }, rules, {}).passes()).toBe(true);
        expect(new Validator({ name: "ali" }, rules, {}).passes()).toBe(true);
        expect(new Validator({ name: "mohamed" }, rules, {}).passes()).toBe(
            true
        );
        expect(new Validator({ name: "mohamed" }, rules, {}).passes()).toBe(
            true
        );
        expect(new Validator({ name: "noName" }, rules, {}).passes()).toBe(
            false
        );
        expect(new Validator({ name: "" }, rules, {}).passes()).toBe(false);
        expect(new Validator({ name: "ahmed," }, rules, {}).passes()).toBe(
            false
        );
        expect(new Validator({ name: "ahmed," }, rules, {}).passes()).toBe(
            false
        );
    });
    test("main not_in methods", () => {
        const rules = Validator.parseRules({
            name: "not_in:ahmed,ali,mohamed",
        });
        expect(new Validator({ name: "ahmed" }, rules, {}).passes()).toBe(
            false
        );
        expect(new Validator({ name: "ali" }, rules, {}).passes()).toBe(false);
        expect(new Validator({ name: "mohamed" }, rules, {}).passes()).toBe(
            false
        );
        expect(new Validator({ name: "mohamed" }, rules, {}).passes()).toBe(
            false
        );
        expect(new Validator({ name: "noName" }, rules, {}).passes()).toBe(
            true
        );
        expect(new Validator({ name: "" }, rules, {}).passes()).toBe(true);
        expect(new Validator({ name: "ahmed," }, rules, {}).passes()).toBe(
            true
        );
        expect(new Validator({ name: "ahmed," }, rules, {}).passes()).toBe(
            true
        );
    });
});
