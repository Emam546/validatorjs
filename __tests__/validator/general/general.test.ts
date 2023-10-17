import Validator, { InputRules } from "@/index";
import { Messages as StringMessages } from "@/Rules/string";
import { Messages as IntMessages } from "@/Rules/int";
import { InvalidPath } from "@/utils/inValidAttr";
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
                name: [{ message: StringMessages[Validator.lang], value: 123 }],
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
    const Rules = {
        name: "string",
    };
    const data = {
        name: "ali",
    };
    const validator = new Validator(Rules);
    expect(validator.validate("name", "string")).toStrictEqual(undefined);
    expect(validator.validate(1234, "string")).toStrictEqual({
        message: StringMessages[Validator.lang],
        value: 1234,
    });
});
describe("test invalid attributes", () => {
    test("test with normal object", () => {
        const validator = new Validator({
            correctPath: "string",
        });
        expect(validator.getErrors({ wrongPath: "value" })).toStrictEqual({
            wrongPath: [
                {
                    message: InvalidPath[Validator.lang],
                    value: "value",
                },
            ],
        });
    });
    test("test with complex objects", () => {
        const validator = new Validator({
            correctPath: [{ str: "string" }, "array"],
        });
        expect(
            validator.getErrors({
                wrongPath: "value",
                correctPath: [{ wrongPath: "value" }],
            })
        ).toStrictEqual({
            wrongPath: [
                {
                    message: InvalidPath[Validator.lang],
                    value: "value",
                },
            ],
            "correctPath.*0.wrongPath": [
                {
                    message: InvalidPath[Validator.lang],
                    value: "value",
                },
            ],
        });
    });
});
describe("test self array rules merging", () => {
    test("test with normal arrays", () => {
        const validator = new Validator({
            correctPath: [["string"], "array", { 0: "integer" }],
        });
        expect(
            validator.getErrors({
                correctPath: [1234],
            })
        ).toStrictEqual({});
        expect(
            validator.getErrors({
                correctPath: [1234, "string"],
            })
        ).toStrictEqual({});
        expect(
            validator.getErrors({
                correctPath: ["string", "string"],
            })
        ).toStrictEqual({
            "correctPath.*0": [
                {
                    message: IntMessages[Validator.lang],
                    value: "string",
                },
            ],
        });
    });
    test("test with normal objects", () => {
        const validator = new Validator({
            correctPath: [["string"], "object", { expected: "integer" }],
        });
        expect(
            validator.getErrors({
                correctPath: { expected: 1234 },
            })
        ).toStrictEqual({});
        expect(
            validator.getErrors({
                correctPath: { expected: 1234, path1: "string" },
            })
        ).toStrictEqual({});
        expect(
            validator.getErrors({
                correctPath: { expected: "string", path1: "string" },
            })
        ).toStrictEqual({
            "correctPath.expected": [
                {
                    message: IntMessages[Validator.lang],
                    value: "string",
                },
            ],
        });
    });
    describe("use . in the object", () => {
        test("test with normal arrays", () => {
            const validator = new Validator({
                correctPath: [
                    ["string"],
                    "array",
                    { 0: "integer", ".": ["required"] },
                ],
            });
            expect(
                validator.getErrors({
                    correctPath: [1234],
                })
            ).toStrictEqual({});
            expect(
                validator.getErrors({
                    correctPath: [1234, "string"],
                })
            ).toStrictEqual({});
            expect(
                validator.getErrors({
                    correctPath: ["string", "string"],
                })
            ).toStrictEqual({
                "correctPath.*0": [
                    {
                        message: IntMessages[Validator.lang],
                        value: "string",
                    },
                ],
            });
        });
        test("test with normal objects", () => {
            const validator = new Validator({
                correctPath: [
                    ["string"],
                    "object",
                    { expected: "integer", ".": ["required"] },
                ],
            });
            expect(
                validator.getErrors({
                    correctPath: { expected: 1234 },
                })
            ).toStrictEqual({});
            expect(
                validator.getErrors({
                    correctPath: { expected: 1234, path1: "string" },
                })
            ).toStrictEqual({});
            expect(
                validator.getErrors({
                    correctPath: { expected: "string", path1: "string" },
                })
            ).toStrictEqual({
                "correctPath.expected": [
                    {
                        message: IntMessages[Validator.lang],
                        value: "string",
                    },
                ],
            });
        });
    });
});
