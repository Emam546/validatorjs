import Validator from "../src/main";

describe("Complex paths test", () => {
    test("test array of rules", () => {
        const Rules = Validator.parseRules({ name: ["string", "number"] });
        const data = {};
        expect(new Validator(data, Rules, {}).CRules).toStrictEqual({
            name: ["string", "number"],
        });
    });
    test("array of objects", () => {
        const Rules = Validator.parseRules({
            person: [{ name: ["string"], age: "integer" }],
        });
        const data = {};
        expect(new Validator(data, Rules, {}).CRules).toStrictEqual({
            "person.*:array.name": ["string"],
            "person.*:array.age": ["integer"],
        });
    });
    test("array of objects", () => {
        const Rules = Validator.parseRules({ person: [["string"], "array"] });
        const data = {};
        expect(new Validator(data, Rules, {}).CRules).toStrictEqual({
            "person.*:array": ["string"],
        });
    });
    test("object of objects", () => {
        const Rules = Validator.parseRules({ person: [["string"], "object"] });
        const data = {};
        expect(new Validator(data, Rules, {}).CRules).toStrictEqual({
            "person.*:object": ["string"],
        });
    });
    test("object with limits", () => {
        const Rules = Validator.parseRules({
            person: [["string"], "object", 0, 2],
        });
        const data = {};
        expect(new Validator(data, Rules, {}).CRules).toStrictEqual({
            "person.*:object": ["string"],
            "person":["limit:0:2"]
        });
    });
});
