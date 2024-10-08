import { InputRules, extractRulesPaths } from "@/index";
import constructRule from "@/utils/constructObj";
import { getAllValues, getValue } from "@/utils/getValue";
import isEmpty from "@/utils/isEmpty";
import mergeObjects from "@/utils/merge";
import { setAllValues, setValue } from "@/utils/setValue";
import validAttr from "@/utils/validAttr";
describe("Test get value methods", () => {
  describe("getValue", () => {
    test("Get Normal", () => {
      expect(getValue({ name: "ahmed" }, "name")).toBe("ahmed");
      expect(getValue({ person: ["ahmed", "ali", "osama"] }, "person.*1")).toBe(
        "ali"
      );
      expect(getValue({ person: ["ahmed", "ali", "osama"] }, "person.*1")).toBe(
        "ali"
      );
      expect(getValue({ person: ["ahmed", "ali", "osama"] }, "person.*2")).toBe(
        "osama"
      );
      expect(getValue({ person: { 1: "ahmed" } }, "person.1")).toBe("ahmed");
      expect(getValue({ person: { "1": "ahmed" } }, "person.1")).toBe("ahmed");
      expect(
        getValue({ person: { "1": { name: ["ahmed"] } } }, "person.1.name.*0")
      ).toBe("ahmed");
      expect(getValue(undefined, "person.1.name.*0")).toBe(undefined);
    });

    test("Get nullable Value", () => {
      expect(getValue({ name: null }, "name")).toStrictEqual(null);
    });
  });
  describe("getAllValues", () => {
    it("regular test", () => {
      expect(getAllValues({ name: "ahmed" }, "name")).toStrictEqual({
        name: "ahmed",
      });
      expect(
        getAllValues({ person: ["ahmed", "ali", "osama"] }, "person.*:array")
      ).toStrictEqual({
        "person.*0": "ahmed",
        "person.*1": "ali",
        "person.*2": "osama",
      });
      expect(
        getAllValues({ person: { 1: "ahmed" } }, "person.*:object")
      ).toStrictEqual({
        "person.1": "ahmed",
      });
      expect(
        getAllValues({ person: { "1": "ahmed" } }, "person.*:object")
      ).toStrictEqual({ "person.1": "ahmed" });
      expect(
        getAllValues(
          { person: { "1": { name: ["ahmed"] } } },
          "person.*:object.name.*:array"
        )
      ).toStrictEqual({ "person.1.name.*0": "ahmed" });
      expect(
        getAllValues(
          {
            person: {
              "1": { name: ["ahmed"] },
              "2": { name: ["ali"] },
            },
          },
          "person.*:object.name.*:array"
        )
      ).toStrictEqual({
        "person.1.name.*0": "ahmed",
        "person.2.name.*0": "ali",
      });
      expect(
        getAllValues(
          {
            person: {
              "1": { name: ["ahmed"] },
              "2": { name: ["ali", "osama", "elsayed"] },
            },
          },
          "person.*:object.name.*:array"
        )
      ).toStrictEqual({
        "person.1.name.*0": "ahmed",
        "person.2.name.*0": "ali",
        "person.2.name.*1": "osama",
        "person.2.name.*2": "elsayed",
      });
    });
    it("nested objects", () => {
      expect(
        getAllValues({ person: { name: "ali" } }, "person.name")
      ).toStrictEqual({
        "person.name": "ali",
      });
      expect(
        getAllValues({ person: { name: "ali" } }, "person.friend.name")
      ).toStrictEqual({});
      expect(
        getAllValues({ person: { name: "ali" } }, "person.friend")
      ).toStrictEqual({});
    });
    test("Get undefined Value", () => {
      expect(getAllValues(undefined, "name")).toStrictEqual({});
    });

    test("Get nullable Value", () => {
      expect(getAllValues({ name: null }, "name")).toStrictEqual({
        name: null,
      });
    });
    test("Get . Values", () => {
      expect(getAllValues({ name: null }, ".")).toStrictEqual({
        ".": {
          name: null,
        },
      });
    });
  });
  describe("use .", () => {
    test("getValues", () => {
      expect(getValue(undefined, ".")).toStrictEqual(undefined);
    });
    test("getValues", () => {
      expect(getValue({ name: "ahmed" }, ".")).toStrictEqual({
        name: "ahmed",
      });
    });
    test("getAllValues", () => {
      expect(getAllValues({ name: "ahmed" }, ".")).toStrictEqual({
        ".": { name: "ahmed" },
      });
    });
  });
});
describe("Test set value methods", () => {
  describe("set Value", () => {
    test("simple", () => {
      const data = { name: "ahmed" };
      expect(setValue(data, "name", "ali")).toBe(true);
      expect(getValue(data, "name")).toBe("ali");
    });
    test("test bad path", () => {
      const data = { name: "ahmed" };
      expect(setValue(data, "badBath", "ali")).toBe(true);
      expect(getValue(data, "badBath")).toBe("ali");
    });
    test("array objects", () => {
      let data: any = { person: ["ahmed", "sayed", "osama"] };
      let path = "person.*1";
      let result = "ali";
      expect(setValue(data, path, result)).toBe(true);
      expect(getValue(data, path)).toBe(result);
      data = { person: ["ahmed", "sayed", "osama"] };
      result = "imam";
      path = "person.*1";
      expect(setValue(data, path, result)).toBe(true);
      expect(getValue(data, path)).toBe(result);
      data = { person: ["ahmed", "sayed", "osama"] };
      result = "imam";
      path = "person.*2";
      expect(setValue(data, path, result)).toBe(true);
      expect(getValue(data, path)).toBe(result);
    });
    test("objects", () => {
      let data: any = { person: { 1: "ahmed" } };
      let result = "ali";
      let path = "person.1";
      expect(setValue(data, path, result)).toBe(true);
      expect(getValue(data, path)).toBe(result);
      data = { person: { person: { "1": "ahmed" } } };
      result = "ali";
      path = "person.1";
      expect(setValue(data, path, result)).toBe(true);
      expect(getValue(data, path)).toBe(result);
      data = { person: { "1": { name: ["ahmed"] } } };
      result = "ali";
      path = "person.1.name.*0";
      expect(setValue(data, path, result)).toBe(true);
      expect(getValue(data, path)).toBe(result);
    });
  });
  describe("set All Values", () => {
    it("regular test", () => {
      let data: any = { name: "ahmed" };
      let path = "name";
      let result: any = "ali";
      expect(setAllValues(data, path, result).every((val) => val)).toBe(true);
      expect(
        Object.values(getAllValues(data, path)).every((val) => val == result)
      ).toBe(true);
      data = { person: ["ahmed", "ali", "osama"] };
      path = "person.*:array";
      result = "ali";
      expect(setAllValues(data, path, result).every((val) => val)).toBe(true);
      expect(
        Object.values(getAllValues(data, path)).every((val) => val == result)
      ).toBe(true);
      data = { person: { 1: "ahmed" } };
      path = "person.*:object";
      result = "ali";
      expect(setAllValues(data, path, result).every((val) => val)).toBe(true);
      expect(
        Object.values(getAllValues(data, path)).every((val) => val == result)
      ).toBe(true);
      data = { person: { "1": { name: ["ahmed"] } } };
      path = "person.*:array.name.*:array";
      result = "ali";
      expect(setAllValues(data, path, result).every((val) => val)).toBe(true);
      expect(
        Object.values(getAllValues(data, path)).every((val) => val == result)
      ).toBe(true);
      data = {
        person: {
          "1": { name: ["ahmed"] },
          "2": { name: ["ali"] },
        },
      };
      path = "person.*:array.name.*:array";
      result = "ali";
      expect(setAllValues(data, path, result).every((val) => val)).toBe(true);
      expect(
        Object.values(getAllValues(data, path)).every((val) => val == result)
      ).toBe(true);
      data = {
        person: {
          "1": { name: ["ahmed"] },
          "2": { name: ["ali", "osama", "elsayed"] },
        },
      };
      path = "person.*:array.name.*:array";
      result = "ali";
      expect(setAllValues(data, path, result).every((val) => val)).toBe(true);
      expect(
        Object.values(getAllValues(data, path)).every((val) => val == result)
      ).toBe(true);
    });
    it("nested objects", () => {
      let data: any = { person: { name: "osama" } };
      let path = "person.name";
      let result: any = "ali";
      expect(setAllValues(data, path, result).every((val) => val)).toBe(true);
      expect(
        Object.values(getAllValues(data, path)).every((val) => val == result)
      ).toBe(true);
      data = { person: { friend: { name: "osama" } } };
      path = "person.friend.name";
      result = "ali";
      expect(setAllValues(data, path, result).every((val) => val)).toBe(true);
      expect(
        Object.values(getAllValues(data, path)).every((val) => val == result)
      ).toBe(true);
      data = { person: { name: "osama" } };
      path = "person.friend.name";
      result = "ali";
      expect(setAllValues(data, path, result).some((val) => val)).toBe(false);
      expect(
        Object.values(getAllValues(data, path)).some((val) => val == result)
      ).toBe(false);
    });
  });
});
describe("test construct methods", () => {
  test("main method", () => {
    const rules = {
      name: ["string"],
      age: ["integer"],
      location: [["integer"], "array", [{ min: 0 }]],
      friends: [["string"], "object", [{ min: 0 }]],
    };
    const res = {
      name: null,
      age: null,
      location: [null, "array", null],
      friends: [null, "object", null],
    };
    expect(constructRule(rules)).toStrictEqual(res);
  });
  test("array object method", () => {
    const rules = {
      name: ["string"],
      age: ["integer"],
      locations: [{ x: ["integer"], y: ["integer"] }, "array"],
      friends: [{ name: "string", age: "integer" }, "object", [{ min: 0 }]],
      schools: [
        {
          locations: [
            {
              x: ["integer"],
              y: ["integer"],
            },
            "array",
            [{ min: 0 }],
          ],
          names: [["string"], "array"],
        },
        "object",
      ],
      email: null,
      site: null,
    };
    const res = {
      name: null,
      age: null,
      locations: [{ x: null, y: null }, "array", null],
      friends: [{ name: null, age: null }, "object", null],
      schools: [
        {
          locations: [
            {
              x: null,
              y: null,
            },
            "array",
            null,
          ],
          names: [null, "array", null],
        },
        "object",
        null,
      ],
      email: null,
      site: null,
    };
    expect(constructRule(rules)).toStrictEqual(res);
  });
  describe("flattened array", () => {
    test("test 1", () => {
      const rules = [{ name: "string", password: "string" }, "array"];
      const ex = [{ name: null, password: null }, "array", null];
      expect(constructRule(rules)).toStrictEqual(ex);
    });
    test("test 2", () => {
      const rules = [
        { name: "string", password: "string" },
        "array",
        [{ min: 0 }],
      ];
      expect(extractRulesPaths(rules)).toStrictEqual({
        "*:array.name": ["string"],
        "*:array.password": ["string"],
        ".": [{ min: 0 }],
      });
      const ex = [{ name: null, password: null }, "array", null];
      expect(constructRule(rules as InputRules)).toStrictEqual(ex);
    });
  });
  test("use .", () => {
    const rules = {
      ".": ["required"],
      person: {
        name: ["string"],
        age: ["integer"],
      },
    };
    const rules2: InputRules = {
      person: {
        name: ["string"],
        age: ["integer"],
        ".": ["required"],
      },
    };
    const ex = {
      person: {
        name: null,
        age: null,
      },
    };
    expect(constructRule(rules)).toStrictEqual(ex);
    expect(constructRule(rules2)).toStrictEqual(ex);
  });
});
describe("Valid attr", () => {
  test("false values", () => {
    const rules = {
      name: ["string"],
      age: ["integer"],
      location: [["integer"], "array", [{ min: 0 }, { max: 2 }]],
    };
    const f1 = {
      name: "",
      age: 0,
      location: [1, 2],
    };
    const f2 = {
      name: "",
      age: 0,
      location: [1, 2],
      unusedAttr: "unused",
    };
    const f3 = {
      name: "",
      age: 0,
      location: [1, 2, { anotheri: 1234 }],
    };

    expect(validAttr(f1, rules)).toStrictEqual(f1);
    expect(validAttr(f2, rules)).toStrictEqual(f1);
    expect(validAttr(f3, rules)).toStrictEqual(f3);
  });
  test("main task", () => {
    const rules: unknown = {
      name: "string",
      age: ["integer"],
      location: [["integer"], "array", [{ min: 0 }, { max: 2 }]],
    };
    const f1 = {
      name: "mahmoud",
      age: 12,
      location: [1, 2],
    };
    const f2 = {
      name: "mahmoud",
      age: 12,
      location: [1, 2],
      unusedAttr: "unused",
    };
    const f3 = {
      name: "mahmoud",
      age: 12,
      location: [1, 2, { anotheri: 1234 }],
    };
    expect(validAttr(f1, rules)).toStrictEqual(f1);
    expect(validAttr(f2, rules)).toStrictEqual(f1);
    expect(validAttr(f3, rules)).toStrictEqual(f3);
  });
  test("array of objects", () => {
    const rules: {
      friends: [{ name: "string"; age: "integer" }];
    } = {
      friends: [{ name: "string", age: "integer" }],
    };
    const f1 = {
      friends: [
        { name: "mahmoud", age: 14 },
        { name: "ali", age: 12 },
        { name: "osama", age: 12 },
        { name: "ahmed", age: 12 },
      ],
    };
    const f2 = {
      friends: [
        { name: "mahmoud", age: 14 },
        { name: "ali", age: 12 },
        { name: "osama", age: 12 },
        { name: "ahmed", age: 12, location: [123, 54645] },
      ],
    };
    expect(validAttr(f1, rules)).toStrictEqual(f1);
    expect(validAttr(f2, rules)).toStrictEqual(f1);
  });
  test("object map", () => {
    const rules: {
      friends: [
        {
          age: "integer";
          email: "string";
          location: [["integer"]];
          friends: [{ age: ["integer"] }, "object"];
        },
        "object"
      ];
    } = {
      friends: [
        {
          age: "integer",
          email: "string",
          location: [["integer"]],
          friends: [{ age: ["integer"] }, "object"],
        },
        "object",
      ],
    };
    const f1 = {
      friends: {
        ahmed: {
          age: 14,
          email: "g@g.com",
          location: [1, 2],
          friends: {
            ahmed: { age: 10 },
            ali: { age: 12 },
          },
        },
        elsayed: { age: 12, email: "a@g.com" },
        ali: { age: 12, email: "c@g.com", location: [1, 2] },
        osama: { age: 12, location: [1, 2] },
      },
    };
    const f2 = {
      friends: {
        ahmed: {
          age: 14,
          email: "g@g.com",
          location: [1, 2],
          friends: {
            ahmed: { age: 10, number: 12 },
            ali: { age: 12 },
          },
        },
        elsayed: { age: 12, email: "a@g.com" },
        ali: { age: 12, email: "c@g.com", location: [1, 2] },
        osama: { age: 12, location: [1, 2] },
      },
    };
    expect(validAttr(f1, rules)).toStrictEqual(f1);
    expect(validAttr(f2, rules)).toStrictEqual(f1);
  });
});
describe("test merge objs methods", () => {
  describe("main way", () => {
    test("simple objects", () => {
      const obj1 = { name: "ali" };
      const obj2 = { age: 12 };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: "ali",
        age: 12,
      });
    });
    test("has the same keys", () => {
      const obj1 = { name: "ali" };
      const obj2 = { age: 12 };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: "ali",
        age: 12,
      });
    });
  });
  describe("complex objects", () => {
    test("with the same name", () => {
      const obj1 = { name: "ali" };
      const obj2 = { name: { firstName: "ali" } };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: { firstName: "ali" },
      });
    });
    test("the first object is bigger an has more keys", () => {
      const obj1 = { en: "ali", fr: "ahmed", ar: "ahmed" };
      const obj2 = { name: { en: "ali" } };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: { en: "ali" },
        en: "ali",
        fr: "ahmed",
        ar: "ahmed",
      });
    });
    test("the first object is bigger an has more keys and different types", () => {
      const obj1 = { en: "ali", fr: "ahmed", ar: "ahmed", name: "ali" };
      const obj2 = { name: { en: "ali" } };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: { en: "ali" },
        en: "ali",
        fr: "ahmed",
        ar: "ahmed",
      });
    });

    test("with the same name and the same value", () => {
      const obj1 = { name: { lastName: "ahmed" } };
      const obj2 = { name: { firstName: "ali" } };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: { firstName: "ali", lastName: "ahmed" },
      });
    });
    test("with the more than one key", () => {
      const obj1 = { name: { lastName: "ahmed" } };
      const obj2 = { name: { firstName: "ali", anotherName: "sayed" } };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: {
          firstName: "ali",
          lastName: "ahmed",
          anotherName: "sayed",
        },
      });
    });
    test("same key inside the object", () => {
      const obj1 = { name: { lastName: "ahmed", firstName: "ali" } };
      const obj2 = { name: { firstName: "ahmed", anotherName: "sayed" } };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: {
          firstName: "ahmed",
          lastName: "ahmed",
          anotherName: "sayed",
        },
      });
    });
    test("same key inside the object but an array", () => {
      const obj1 = {
        name: { lastName: "ahmed", firstName: ["a", "l", "i"] },
      };
      const obj2 = { name: { firstName: "ahmed", anotherName: "sayed" } };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: {
          firstName: ["a", "l", "i"],
          lastName: "ahmed",
          anotherName: "sayed",
        },
      });
    });
  });
  describe("complex arrays", () => {
    test("with the same name", () => {
      const obj1 = { name: "ali" };
      const obj2 = { name: [{ firstName: "ali" }] };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: [{ firstName: "ali" }],
      });
    });
    test("with the same name and the same value", () => {
      const obj1 = { name: [{ lastName: "ahmed" }] };
      const obj2 = { name: [{ firstName: "ali" }] };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: [{ firstName: "ali", lastName: "ahmed" }],
      });
    });
    test("with the same name and the same value but with more than one key", () => {
      const obj1 = { name: [{ lastName: "ahmed" }] };
      const obj2 = { name: [{ firstName: "ali", nickName: "bob" }] };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: [{ firstName: "ali", lastName: "ahmed", nickName: "bob" }],
      });
    });
    test("with the same name and the same value but different types", () => {
      const obj1 = { name: [{ lastName: "ahmed" }] };
      const obj2 = { name: ["string"] };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: [{ lastName: "ahmed" }],
      });
    });
    test("with the same name and the same value but with different indexes", () => {
      const obj1 = { name: [{ lastName: "ahmed" }] };
      const obj2 = {
        name: [{ lastName: "sayed" }, { firstName: "ali" }],
      };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: [{ lastName: "sayed" }, { firstName: "ali" }],
      });
    });
    test("with the same name and the same value but with different indexes and values", () => {
      const obj1 = { name: [{ lastName: "ahmed" }] };
      const obj2 = {
        name: [
          { lastName: "sayed" },
          { firstName: "ahmed", lastName: "sayed" },
        ],
      };
      expect(mergeObjects(obj1, obj2)).toStrictEqual({
        name: [
          { lastName: "sayed" },
          { firstName: "ahmed", lastName: "sayed" },
        ],
      });
    });
  });
});
describe("Test isEmpty", () => {
  it("simple tests", () => {
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty(true)).toBe(false);
    expect(isEmpty(false)).toBe(false);
    expect(isEmpty("string")).toBe(false);
    expect(isEmpty("")).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([null])).toBe(false);
    expect(isEmpty([undefined])).toBe(false);
    expect(isEmpty(123213)).toBe(false);
    expect(isEmpty(-1232131)).toBe(false);
    expect(isEmpty(-1232131)).toBe(false);
  });
});
