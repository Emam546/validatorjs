import Validator, { parseRules } from "../main";
import { string, int, min, limit } from "../Rules";

describe("test some validators",  () => {
    const DefaultValidator = new Validator({}, {}, {});
    test("test int method", async () => {
        expect(await await int.validate(10, "int", DefaultValidator, "", "en")).toBe(
            undefined
        );
        expect(
            await await int.validate(new Number(1234), "int", DefaultValidator, "", "en")
        ).toBe(undefined);
        expect(await int.validate(+"10", "int", DefaultValidator, "", "en")).toBe(
            undefined
        );
        expect(await int.validate("10", "int", DefaultValidator, "", "en")).not.toBe(
            undefined
        );
        expect(await int.validate(null, "int", DefaultValidator, "", "en")).not.toBe(
            undefined
        );
    });
    test("test string method",  async () => {
        expect(
            await string.validate("my string", "string", DefaultValidator, "", "en")
        ).toBe(undefined);
        expect(
            await string.validate(
                new String("string"),
                "string",
                DefaultValidator,
                "",
                "en"
            )
        ).toBe(undefined);
        expect(
            await string.validate("1234", "string", DefaultValidator, "", "en")
        ).toBe(undefined);
        expect(
            await string.validate(1234, "string", DefaultValidator, "", "en")
        ).not.toBe(undefined);
        expect(
            await string.validate(null, "string", DefaultValidator, "", "en")
        ).not.toBe(undefined);
    });
});
describe("test min method",  () => {
    const DefaultValidator = new Validator({}, {}, {});
    test("main method",  async () => {
        expect(await min.validate(9, "min", DefaultValidator, "", "en")).toBe(
            undefined
        );
        expect(await min.validate(2, "min:3", DefaultValidator, "", "en")).not.toBe(
            undefined
        );
        expect(await min.validate(11, "min:11", DefaultValidator, "", "en")).toBe(
            undefined
        );
        expect(await min.validate(-1, "min:0", DefaultValidator, "", "en")).not.toBe(
            undefined
        );
        expect(await min.validate(12.5, "min:12.4", DefaultValidator, "", "en")).toBe(
            undefined
        );
    });
    test("object and other data types",  async () => {
        expect(
            await min.validate([0, 1, 2], "min:0", DefaultValidator, "", "en")
        ).toBe(undefined);
        expect(
            await min.validate([0, 1, 2], "min:5", DefaultValidator, "", "en")
        ).not.toBe(undefined);
        expect(await min.validate({}, "min:1", DefaultValidator, "", "en")).not.toBe(
            undefined
        );

        expect(
            await min.validate(
                { name: "ahmed", age: "12" },
                "min:0",
                DefaultValidator,
                "",
                "en"
            )
        ).toBe(undefined);
    });
    test("string method",  async () => {
        expect(
            await min.validate("string", "min:3", DefaultValidator, "", "en")
        ).toBe(undefined);
        expect(
            await min.validate("string", "min:7", DefaultValidator, "", "en")
        ).not.toBe(undefined);
        expect(
            await min.validate(
                new String("string"),
                "min:0",
                DefaultValidator,
                "",
                "en"
            )
        ).toBe(undefined);
        expect(
            await min.validate(
                new String("string"),
                "min:7",
                DefaultValidator,
                "",
                "en"
            )
        ).not.toBe(undefined);
    });
});
describe("limit method",   () => {
    const DefaultValidator = new Validator({}, {}, {});
    test("main method",  async () => {
        expect(
            await limit.validate(9, "limit:0:10", DefaultValidator, "", "en")
        ).toBe(undefined);
        expect(
            await limit.validate(2, "limit:3:5", DefaultValidator, "", "en")
        ).not.toBe(undefined);
        expect(
            await limit.validate(11, "limit:0:11", DefaultValidator, "", "en")
        ).toBe(undefined);
        expect(
            await limit.validate(-1, "limit:0:10", DefaultValidator, "", "en")
        ).not.toBe(undefined);
        expect(
            await limit.validate(0, "limit:0.5:10", DefaultValidator, "", "en")
        ).not.toBe(undefined);
        expect(
            await limit.validate(0.5, "limit:0.5:10", DefaultValidator, "", "en")
        ).toBe(undefined);
        expect(
            await limit.validate(9.5, "limit:0.5:9.5", DefaultValidator, "", "en")
        ).toBe(undefined);
    });
    test("object and other data types",  async () => {
        expect(
            await limit.validate([0, 1, 2], "limit:0:5", DefaultValidator, "", "en")
        ).toBe(undefined);
        expect(
            await limit.validate([0, 1, 2], "limit:0:2", DefaultValidator, "", "en")
        ).not.toBe(undefined);
        expect(
            await limit.validate({}, "limit:1:5", DefaultValidator, "", "en")
        ).not.toBe(undefined);
        expect(
            await limit.validate(
                { name: "ahmed", age: "12" },
                "limit:0:5",
                DefaultValidator,
                "",
                "en"
            )
        ).toBe(undefined);
    });
    test("string method",  async () => {
        expect(
            await limit.validate("string", "limit:3:10", DefaultValidator, "", "en")
        ).toBe(undefined);
        expect(
            await limit.validate("string", "limit:7:8", DefaultValidator, "", "en")
        ).not.toBe(undefined);
        expect(
            await limit.validate(
                new String("string"),
                "limit:0:8",
                DefaultValidator,
                "",
                "en"
            )
        ).toBe(undefined);
        expect(
            await limit.validate(
                new String("string"),
                "limit:7:8",
                DefaultValidator,
                "",
                "en"
            )
        ).not.toBe(undefined);
    });
});
describe("required method",   () => {
    test("regular Test",  async() => {
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
            ).passes()
        ).toBe(true);
        expect(
            await new Validator(
                {
                    email: null,
                },
                rules,
                {}
            ).passes()
        ).toBe(false);
    });
    test("array objects",  async () => {
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
            ).passes()
        ).toBe(true);
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
            ).passes()
        ).toBe(false);
        expect(
            await new Validator(
                { users: [{ email: "g@g", password: "123" }] },
                rules,
                {}
            ).passes()
        ).toBe(true);
        expect(await new Validator({ users: [] }, rules, {}).passes()).toBe(true);
        expect(await new Validator({}, rules, {}).passes()).toBe(false);
        expect(
            await new Validator(
                {
                    email: "Email",
                    password: "password",
                },
                rules,
                {}
            ).passes()
        ).toBe(false);
    });
});
describe("required if method",   () => {
    test("regular Test",  async() => {
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
        expect(await new Validator({ name: "not admin" }, rules, {}).passes()).toBe(
            true
        );
        expect(await new Validator({}, rules, {}).passes()).toBe(true);
    });
    test("array objects",  async () => {
        const rules = Validator.parseRules({
            users: [{ password: [`required_if:name,"admin"`] }],
        });
        expect(
            await new Validator(
                { users: [{ password: "123", name: "admin" }] },
                rules,
                {}
            ).passes()
        ).toBe(true);
        expect(
            await new Validator({ users: [{ name: "admin" }] }, rules, {}).passes()
        ).toBe(false);
        expect(
            await new Validator(
                { users: [{ name: "not admin" }] },
                rules,
                {}
            ).passes()
        ).toBe(true);
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
            ).passes()
        ).toBe(true);
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
            ).passes()
        ).toBe(true);
    });
    test("objects",  async () => {
        const rules = Validator.parseRules({
            users: [{ password: [`required_if:name,"admin"`] }, "object"],
        });
        expect(
            await new Validator(
                { users: [{ password: "123", name: "admin" }] },
                rules,
                {}
            ).passes()
        ).toBe(false);
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
            ).passes()
        ).toBe(true);
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
            ).passes()
        ).toBe(true);
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
            ).passes()
        ).toBe(false);
    });
});
describe("required without method",  () => {
    test("regular method",  async () => {
        const rules = parseRules({
            email: ["required_without:name,phone"],
        });
        expect(await new Validator({ email: "123@g.com" }, rules, {}).passes()).toBe(
            true
        );
        expect(
            await new Validator({ name: "ali", phone: "123" }, rules, {}).passes()
        ).toBe(true);
        expect(await new Validator({ name: "ali" }, rules, {}).passes()).toBe(false);
        expect(await new Validator({}, rules, {}).passes()).toBe(false);
        expect(
            await new Validator({ email: "123", phone: "123" }, rules, {}).passes()
        ).toBe(true);
    });
    test("array object",  async () => {
        const rules = parseRules({
            users: [{ email: ["required_without:name,phone"] }],
        });
        expect(
            await new Validator(
                { users: [{ email: "123@g.com" }] },
                rules,
                {}
            ).passes()
        ).toBe(true);
        expect(
            await new Validator(
                { users: [{ name: "ali", phone: "123" }] },
                rules,
                {}
            ).passes()
        ).toBe(true);
        expect(
            await new Validator(
                { users: [{ name: "ali", phone: "123" }, {}] },
                rules,
                {}
            ).passes()
        ).toBe(false);
        expect(
            await new Validator({ users: [{ name: "ali" }] }, rules, {}).passes()
        ).toBe(false);
        expect(await new Validator({ users: [{}] }, rules, {}).passes()).toBe(false);
        expect(await new Validator({ users: [] }, rules, {}).passes()).toBe(true);
        expect(
            await new Validator(
                { users: { 1: { email: "123", phone: "123" } } },
                rules,
                {}
            ).passes()
        ).toBe(false);
    });
});
