import { extractRulesPaths } from "@/index";
describe("extractRulesPaths", () => {
  it("main methods", () => {
    expect(
      extractRulesPaths({
        name: "string",
      })
    ).toStrictEqual({
      name: ["string"],
    });

    expect(extractRulesPaths({ name: "string|integer" })).toStrictEqual({
      name: ["string", "integer"],
    });
    expect(extractRulesPaths(["string", "integer"])).toStrictEqual({
      ".": ["string", "integer"],
    });
    expect(extractRulesPaths([])).toStrictEqual({
      ".": [],
    });
  });
  describe("array methods", () => {
    test("Normal array", () => {
      expect(
        extractRulesPaths([[{ name: [["string"]], age: "integer" }]])
      ).toStrictEqual({
        "*:array.*:array.name.*:array": ["string"],
        "*:array.*:array.age": ["integer"],
      });

      expect(
        extractRulesPaths([{ name: "string", age: "integer" }])
      ).toStrictEqual({
        "*:array.name": ["string"],
        "*:array.age": ["integer"],
      });
      expect(
        extractRulesPaths([[{ name: "string", age: "integer" }]])
      ).toStrictEqual({
        "*:array.*:array.name": ["string"],
        "*:array.*:array.age": ["integer"],
      });

      expect(extractRulesPaths(["string"])).toStrictEqual({ ".": ["string"] });
    });
    it("flattened object", () => {
      expect(extractRulesPaths([["string"], "array"])).toStrictEqual({
        "*:array": ["string"],
      });
      expect(
        extractRulesPaths([["string"], "array", ["required"]])
      ).toStrictEqual({
        "*:array": ["string"],
        ".": ["required"],
      });
    });
    it("complex object", () => {
      expect(extractRulesPaths({ names: [["string"], "array"] })).toStrictEqual(
        {
          "names.*:array": ["string"],
        }
      );
      expect(
        extractRulesPaths({
          names: [
            ["string"],
            "array",
            {
              0: ["string"],
            },
          ],
        })
      ).toStrictEqual({
        "names.*:array": ["string"],
        "names.0": ["string"],
      });
      expect(
        extractRulesPaths({ names: [["string"], "array", ["required"]] })
      ).toStrictEqual({
        "names.*:array": ["string"],
        names: ["required"],
      });
      const rules = extractRulesPaths({
        name: ["string"],
        age: ["integer"],
        location: [["integer"], "array", [{ min: 0 }]],
        friends: [["string"], "object", [{ min: 0 }]],
      });
      expect(rules).toStrictEqual({
        name: ["string"],
        age: ["integer"],
        "location.*:array": ["integer"],
        "friends.*:object": ["string"],
        location: [{ min: 0 }],
        friends: [{ min: 0 }],
      });
      expect(
        extractRulesPaths([
          { name: "string", password: "string" },
          "array",
          [{ min: 0 }],
        ])
      ).toStrictEqual({
        "*:array.name": ["string"],
        "*:array.password": ["string"],
        ".": [{ min: 0 }],
      });
    });
  });
  it("use .", () => {
    expect(
      extractRulesPaths({
        ".": ["string"],
      })
    ).toStrictEqual({ ".": ["string"] });
    expect(
      extractRulesPaths({
        person: { name: ["string"], ".": "required" },
      })
    ).toStrictEqual({ "person.name": ["string"], person: ["required"] });
    expect(
      extractRulesPaths({
        person: { name: ["string"], ".": "required" },
        ".": ["required"],
      })
    ).toStrictEqual({
      "person.name": ["string"],
      person: ["required"],
      ".": ["required"],
    });
  });
});
