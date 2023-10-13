import Validator, { InputRules } from "@/index";
import { Messages } from "@/Rules/string";
describe("test validate", () => {
    test("check passes function", () => {
        const data = {
            name: "ali",
        };
        const validator = new Validator({
            name: "string",
        });
        expect(validator.CPaths).toStrictEqual({ name: ["string"] });
        expect(validator.passes(data)).toEqual({
            state: true,
            data,
        });
        expect(
            validator.passes({
                name: 123,
            })
        ).toStrictEqual({
            state: false,
            errors: {
                name: [{ message: Messages[validator.lang], value: 123 }],
            },
        });
    });
    test("test object describing", () => {
        const Rules: InputRules = {
            person: [
                {
                    age: ["integer"],
                    friends: [["string"], "array", [{ min: 0 }, { max: 10 }]],
                },
                "object",
            ],
        };
        const validator = new Validator(Rules);
        expect(
            validator.getErrors({
                person: { ahmed: { friends: ["ahmed", "ali"] } },
            })
        ).toStrictEqual({});

        expect(
            validator.getErrors({
                person: {
                    ahmed: { age: 12, friends: ["ahmed", "ali", "new friend"] },
                },
            })
        ).toStrictEqual({});

        expect(
            validator.getErrors({
                person: [{ age: 12, friends: ["ahmed", "ali", "new friend"] }],
            })
        ).not.toStrictEqual({ state: false });
    });
    describe("test with array", () => {
        test("test 1", () => {
            const data = {
                friendsNames: ["ahmed", "ali", "osama", "said"],
            };
            const validator = new Validator({
                friendsNames: [["string"]],
            });
            expect(validator.getErrors(data)).toStrictEqual({});
            const data2 = {
                friendsNames: ["ahmed", 12, 231, "osama", "said"],
            };
            expect(validator.passes(data2)).not.toStrictEqual({});
        });
        test("test object", () => {
            const data = {
                friendsNames: {
                    name1: "ahmed",
                    name2: "osama",
                    name3: "said",
                },
            };
            const validator = new Validator({
                friendsNames: [["string"], "object"],
            });
            expect(validator.getErrors(data)).toStrictEqual({});
            expect(
                validator.getErrors({
                    friendsNames: {
                        1: "ahmed",
                        2: "osama",
                        3: "said",
                    },
                })
            ).toStrictEqual({});
            expect(
                validator.getErrors({
                    friendsNames: {
                        1: "ahmed",
                        2: "osama",
                        3: 1234,
                    },
                })
            ).toStrictEqual({
                "friendsNames.3": [
                    {
                        message: "THE TYPE OF INPUT IS NOT STRING",
                        value: 1234,
                    },
                ],
            });
        });
    });
});
test("IF THE RULE EXIST", () => {
    const Rules = Validator.extractRulesPaths({
        name: "string",
    });
    const data = {
        name: "ali",
    };
    const validator = new Validator(Rules);
    expect(validator.validate("name", "string", "")).toStrictEqual(undefined);
    expect(validator.validate(1234, "string", "")).toStrictEqual({
        message: Messages[validator.lang],
        value: 1234,
    });
});
describe("test invalid Attributes", () => {});
describe("test self array rules", () => {});
describe("test constructing method", () => {});
