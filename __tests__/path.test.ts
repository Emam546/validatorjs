import ValidatorClass from "@/index";

describe("Complex paths test", () => {
  test("test array of rules", () => {
    const Rules = ValidatorClass.extractRulesPaths({
      name: ["string", "integer"],
    });
    expect(Rules).toStrictEqual({
      name: ["string", "integer"],
    });
  });
  test("normal array", () => {
    const Rules = ValidatorClass.extractRulesPaths({
      person: [{ name: ["string"], age: "integer" }],
    });
    expect(Rules).toStrictEqual({
      "person.*:array.name": ["string"],
      "person.*:array.age": ["integer"],
    });
  });
  test("array of objects", () => {
    const Rules = ValidatorClass.extractRulesPaths({
      person: [["string"], "object"],
    });

    expect(Rules).toStrictEqual({
      "person.*:object": ["string"],
    });
  });
  test("object of objects", () => {
    const Rules = ValidatorClass.extractRulesPaths({
      person: [["string"], "object"],
    });

    expect(Rules).toStrictEqual({
      "person.*:object": ["string"],
    });
  });
});
