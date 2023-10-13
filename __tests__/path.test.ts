import Validator from "@/index";

describe("Complex paths test", () => {
    test("test array of rules", () => {
        const Rules = Validator.extractRulesPaths({
            name: ["string", "integer"],
        });
        expect(Rules).toStrictEqual({
            name: ["string", "integer"],
        });
    });
    test("normal array", () => {
        const Rules = Validator.extractRulesPaths({
            person: [{ name: ["string"], age: "integer" }],
        });
        expect(Rules).toStrictEqual({
            "person.*:array.name": ["string"],
            "person.*:array.age": ["integer"],
        });
    });
    test("array of objects", () => {
        const Rules = Validator.extractRulesPaths({
            person: [["string"], "object"],
        });

        expect(Rules).toStrictEqual({
            "person.*:object": ["string"],
        });
    });
    test("object of objects", () => {
        const Rules = Validator.extractRulesPaths({
            person: [["string"], "object"],
        });

        expect(Rules).toStrictEqual({
            "person.*:object": ["string"],
        });
    });
});
