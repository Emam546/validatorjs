import Validator, { parseRules, Rules } from "@/index";
import { AllRules } from "@/Rules";
const { string, int, min, limit, regExp } = AllRules;
describe("test some validators", () => {
    test("test int method", async () => {
        const Rules = Validator.parseRules({
            val: "integer",
        });
        expect(
            await new Validator({ val: +"10" }, Rules).getErrors()
        ).toBeNull();
        expect(
            await new Validator({ val: new Number(1234) }, Rules).getErrors()
        ).toBeNull();
        expect(
            await new Validator({ val: NaN }, Rules).getErrors()
        ).not.toBeNull();
        expect(
            await new Validator({ val: "10" }, Rules).getErrors()
        ).not.toBeNull();
        expect(
            await new Validator({ val: null }, Rules).getErrors()
        ).not.toBeNull();
    });
    test("test string method", async () => {
        const Rules = Validator.parseRules({
            val: "string",
        });
        expect(
            await new Validator({ val: "my string" }, Rules).getErrors()
        ).toBeNull();
        expect(
            await new Validator(
                { val: new String("string") },
                Rules
            ).getErrors()
        ).toBeNull();
        expect(
            await new Validator({ val: "1234" }, Rules).getErrors()
        ).toBeNull();
        expect(
            await new Validator({ val: 1234 }, Rules).getErrors()
        ).not.toBeNull();
        expect(
            await new Validator({ val: null }, Rules).getErrors()
        ).not.toBeNull();
    });
});

describe("required method", () => {
    test("regular Test", async () => {
        const rules = Validator.parseRules({
            email: ["required"],
            password: ["required"],
        });
        expect(
            await new Validator(
                {
                    email: null,
                    password: null,
                },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
        expect(
            await new Validator(
                {
                    email: null,
                },
                rules,
                {}
            ).getErrors()
        ).not.toBeNull();
    });
    test("array objects", async () => {
        const rules = Validator.parseRules({
            users: [{ email: ["required"], password: ["required"] }],
        });
        expect(
            await new Validator(
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
            await new Validator(
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
            await new Validator(
                { users: [{ email: "g@g", password: "123" }] },
                rules,
                {}
            ).passes()
        ).toBe(true);
        expect(await new Validator({ users: [] }, rules, {}).passes()).toBe(
            true
        );
        expect(await new Validator({}, rules, {}).passes()).toBe(true);
        expect(
            await new Validator(
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
    test("regular Test", async () => {
        const rules = Validator.parseRules({
            password: [`required_if:name,"admin"`],
        });
        expect(
            await new Validator(
                {
                    name: "admin",
                    password: "1234",
                },
                rules,
                {}
            ).passes()
        ).toBe(true);
        expect(await new Validator({ name: "admin" }, rules, {}).passes()).toBe(
            false
        );
        expect(
            await new Validator({ name: "not admin" }, rules, {}).passes()
        ).toBe(true);
        expect(await new Validator({}, rules, {}).passes()).toBe(true);
    });
    test("array objects", async () => {
        const rules = Validator.parseRules({
            users: [{ password: [`required_if:name,"admin"`] }],
        });
        expect(
            await new Validator(
                { users: [{ password: "123", name: "admin" }] },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
        expect(
            await new Validator(
                { users: [{ name: "admin" }] },
                rules,
                {}
            ).passes()
        ).toBe(false);
        expect(
            await new Validator(
                { users: [{ name: "not admin" }] },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
        expect(
            await new Validator(
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
            await new Validator(
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
    test("objects", async () => {
        const rules = Validator.parseRules({
            users: [{ password: [`required_if:name,"admin"`] }, "object"],
        });
        expect(
            await new Validator(
                { users: [{ password: "123", name: "admin" }] },
                rules,
                {}
            ).getErrors()
        ).not.toBeNull();
        expect(
            await new Validator(
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
            await new Validator(
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
            await new Validator(
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
    test("regular method", async () => {
        const rules = parseRules({
            email: ["required_without:name,phone"],
        });
        expect(
            await new Validator({ email: "123@g.com" }, rules, {}).passes()
        ).toBe(true);
        expect(
            await new Validator(
                { name: "ali", phone: "123" },
                rules,
                {}
            ).passes()
        ).toBe(true);
        expect(await new Validator({ name: "ali" }, rules, {}).passes()).toBe(
            false
        );
        expect(await new Validator({}, rules, {}).passes()).toBe(false);
        expect(
            await new Validator(
                { email: "123", phone: "123" },
                rules,
                {}
            ).passes()
        ).toBe(true);
    });
    test("array object", async () => {
        const rules = parseRules({
            users: [{ email: ["required_without:name,phone"] }],
        });
        expect(
            await new Validator(
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
            await new Validator(
                { users: [{ email: "123@g.com" }] },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
        expect(
            await new Validator(
                { users: [{ name: "ali", phone: "123" }] },
                rules,
                {}
            ).getErrors()
        ).toBeNull();
        expect(
            await new Validator(
                { users: [{ name: "ali", phone: "123" }, {}] },
                rules,
                {}
            ).getErrors()
        ).not.toBeNull();
        expect(
            await new Validator(
                { users: [{ name: "ali" }] },
                rules,
                {}
            ).passes()
        ).toBe(false);
        expect(await new Validator({ users: [{}] }, rules, {}).passes()).toBe(
            false
        );
        expect(await new Validator({ users: [] }, rules, {}).passes()).toBe(
            true
        );
        expect(
            await new Validator(
                { users: { 1: { email: "123", phone: "123" } } },
                rules
            ).getErrors()
        ).not.toBeNull();
        expect(await new Validator({}, rules, {}).passes()).toBe(true);
    });
});
describe("test regEx", () => {
    test("simple string", async () => {
        const reg = /(^myWord)$/gi;
        const myExp = { val: ["regex:/(^myWord)$/"] };
        expect(await new Validator({ val: "myWord" }, myExp, {}).passes()).toBe(
            true
        );
        expect(await new Validator({ val: "string" }, myExp, {}).passes()).toBe(
            false
        );
        expect(
            await new Validator({ val: " myWord" }, myExp, {}).passes()
        ).toBe(false);
        expect(
            await new Validator({ val: "myWord " }, myExp, {}).passes()
        ).toBe(false);
    });
});
