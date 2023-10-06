import Validator, { parseRules, Rule } from "@/index";
describe("test some validators", () => {
    test("test int method", () => {
        const Rules = Validator.parseRules({
            val: "integer",
        });
        expect(new Validator({ val: +"10" }, Rules).passes()).toBe(true);
        expect(new Validator({ val: new Number(1234) }, Rules).passes()).toBe(
            true
        );
        expect(new Validator({ val: NaN }, Rules).passes()).not.toBe(true);
        expect(new Validator({ val: "10" }, Rules).passes()).not.toBe(true);
        expect(new Validator({ val: null }, Rules).passes()).not.toBe(true);
    });
    test("test string method", () => {
        const Rules = Validator.parseRules({
            val: "string",
        });
        expect(new Validator({ val: "my string" }, Rules).passes()).toBe(true);
        expect(
            new Validator({ val: new String("string") }, Rules).passes()
        ).toBe(true);
        expect(new Validator({ val: "1234" }, Rules).passes()).toBe(true);
        expect(new Validator({ val: 1234 }, Rules).passes()).not.toBe(true);
        expect(new Validator({ val: null }, Rules).passes()).not.toBe(true);
    });
});

describe("required method", () => {
    test("regular Test", () => {
        const rules = Validator.parseRules({
            email: ["required"],
            password: ["required"],
        });
        expect(
            new Validator(
                {
                    email: null,
                    password: null,
                },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
        expect(
            new Validator(
                {
                    email: null,
                },
                rules,
                {}
            ).getErrors()
        ).not.toBeNull();
    });
    test("array objects", () => {
        const rules = Validator.parseRules({
            users: [{ email: ["required"], password: ["required"] }],
        });
        expect(
            new Validator(
                {
                    users: [
                        { email: "g@g", password: "123" },
                        { email: "g@g", password: "123" },
                    ],
                },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
        expect(
            new Validator(
                {
                    users: [
                        { email: "g@g", password: "123" },
                        { email: "g@g" },
                    ],
                },
                rules,
                {}
            ).getErrors()
        ).not.toBeNull();
        expect(
            new Validator(
                { users: [{ email: "g@g", password: "123" }] },
                rules,
                {}
            ).passes()
        ).toBe(true);
        expect(new Validator({ users: [] }, rules, {}).passes()).toBe(true);
        expect(new Validator({}, rules, {}).passes()).toBe(true);
        expect(
            new Validator(
                {
                    email: "Email",
                    password: "password",
                },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
    });
});
describe("required if method", () => {
    test("regular Test", () => {
        const rules = Validator.parseRules({
            password: [`required_if:name,"admin"`],
        });
        expect(
            new Validator(
                {
                    name: "admin",
                    password: "1234",
                },
                rules,
                {}
            ).passes()
        ).toBe(true);
        expect(new Validator({ name: "admin" }, rules, {}).passes()).toBe(
            false
        );
        expect(new Validator({ name: "not admin" }, rules, {}).passes()).toBe(
            true
        );
        expect(new Validator({}, rules, {}).passes()).toBe(true);
    });
    test("array objects", () => {
        const rules = Validator.parseRules({
            users: [{ password: [`required_if:name,"admin"`] }],
        });
        expect(
            new Validator(
                { users: [{ password: "123", name: "admin" }] },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
        expect(
            new Validator({ users: [{ name: "admin" }] }, rules, {}).passes()
        ).toBe(false);
        expect(
            new Validator(
                { users: [{ name: "not admin" }] },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
        expect(
            new Validator(
                {
                    users: [
                        { password: "123" },
                        { password: "123", name: "admin" },
                    ],
                },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
        expect(
            new Validator(
                {
                    users: [
                        { password: "123" },
                        { password: "123", name: "not admin" },
                    ],
                },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
    });
    test("objects", () => {
        const rules = Validator.parseRules({
            users: [{ password: [`required_if:name,"admin"`] }, "object"],
        });
        expect(
            new Validator(
                { users: [{ password: "123", name: "admin" }] },
                rules,
                {}
            ).getErrors()
        ).not.toBeNull();
        expect(
            new Validator(
                {
                    users: {
                        1: { password: "123", name: "admin" },
                        2: { password: "3424", name: "admin" },
                    },
                },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
        expect(
            new Validator(
                {
                    users: {
                        1: { password: "123", name: "admin" },
                        2: { name: "not admin" },
                    },
                },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
        expect(
            new Validator(
                {
                    users: {
                        1: { password: "123", name: "admin" },
                        2: { name: "admin" },
                    },
                },
                rules,
                {}
            ).getErrors()
        ).not.toBeNull();
    });
});
describe("required without method", () => {
    test("regular method", () => {
        const rules = parseRules({
            email: ["required_without:name,phone"],
        });
        expect(new Validator({ email: "123@g.com" }, rules, {}).passes()).toBe(
            true
        );
        expect(
            new Validator({ name: "ali", phone: "123" }, rules, {}).passes()
        ).toBe(true);
        expect(new Validator({ name: "ali" }, rules, {}).passes()).toBe(false);
        expect(new Validator({}, rules, {}).passes()).toBe(false);
        expect(
            new Validator({ email: "123", phone: "123" }, rules, {}).passes()
        ).toBe(true);
    });
    test("array object", () => {
        const rules = parseRules({
            users: [{ email: ["required_without:name,phone"] }],
        });
        expect(
            new Validator(
                {
                    users: [
                        { email: "123@g.com" },
                        { name: "ali", phone: "123" },
                        { name: "ali" },
                    ],
                },
                rules
            ).getErrors()
        ).not.toBeNull();
        expect(
            new Validator(
                { users: [{ email: "123@g.com" }] },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
        expect(
            new Validator(
                { users: [{ name: "ali", phone: "123" }] },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
        expect(
            new Validator(
                { users: [{ name: "ali", phone: "123" }, {}] },
                rules,
                {}
            ).getErrors()
        ).not.toBeNull();
        expect(
            new Validator({ users: [{ name: "ali" }] }, rules, {}).passes()
        ).toBe(false);
        expect(new Validator({ users: [{}] }, rules, {}).passes()).toBe(false);
        expect(new Validator({ users: [] }, rules, {}).passes()).toBe(true);
        expect(
            new Validator(
                { users: { 1: { email: "123", phone: "123" } } },
                rules
            ).getErrors()
        ).not.toBeNull();
        expect(new Validator({}, rules, {}).passes()).toBe(true);
    });
});
describe("test regEx", () => {
    test("simple string", () => {
        const reg = /(^myWord)$/gi;
        const myExp = { val: ["regex:/(^myWord)$/"] };
        expect(new Validator({ val: "myWord" }, myExp, {}).passes()).toBe(true);
        expect(new Validator({ val: "string" }, myExp, {}).passes()).toBe(
            false
        );
        expect(new Validator({ val: " myWord" }, myExp, {}).passes()).toBe(
            false
        );
        expect(new Validator({ val: "myWord " }, myExp, {}).passes()).toBe(
            false
        );
    });
});
