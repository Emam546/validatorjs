import { parseRules } from "../src/main";
import constructRule from "../src/utils/constructObj";
import { getAllValues, getValue } from "../src/utils/getValue";
import inValidAttr from "../src/utils/inValidAttr";
import isEmpty from "../src/utils/isEmpty";
import mergeObjects from "../src/utils/merge";
import { setAllValues, setValue } from "../src/utils/setValue";
import validAttr from "../src/utils/validAttr";

describe("Test get value methods", () => {
    test("getValue", () => {
        expect(getValue({ name: "ahmed" }, "name")).toBe("ahmed");
        expect(
            getValue({ person: ["ahmed", "ali", "osama"] }, "person.*1")
        ).toBe("ali");
        expect(
            getValue({ person: ["ahmed", "ali", "osama"] }, "person.*1")
        ).toBe("ali");
        expect(
            getValue({ person: ["ahmed", "ali", "osama"] }, "person.*2")
        ).toBe("osama");
        expect(getValue({ person: { 1: "ahmed" } }, "person.1")).toBe("ahmed");
        expect(getValue({ person: { "1": "ahmed" } }, "person.1")).toBe(
            "ahmed"
        );
        expect(
            getValue(
                { person: { "1": { name: ["ahmed"] } } },
                "person.1.name.*0"
            )
        ).toBe("ahmed");
    });
    describe("get All Values", () => {
        it("regular test", () => {
            expect(getAllValues({ name: "ahmed" }, "name")).toStrictEqual({
                name: "ahmed",
            });
            expect(
                getAllValues(
                    { person: ["ahmed", "ali", "osama"] },
                    "person.*:array"
                )
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
            expect(setAllValues(data, path, result).every((val) => val)).toBe(
                true
            );
            expect(
                Object.values(getAllValues(data, path)).every(
                    (val) => val == result
                )
            ).toBe(true);
            data = { person: ["ahmed", "ali", "osama"] };
            path = "person.*:array";
            result = "ali";
            expect(setAllValues(data, path, result).every((val) => val)).toBe(
                true
            );
            expect(
                Object.values(getAllValues(data, path)).every(
                    (val) => val == result
                )
            ).toBe(true);
            data = { person: { 1: "ahmed" } };
            path = "person.*:object";
            result = "ali";
            expect(setAllValues(data, path, result).every((val) => val)).toBe(
                true
            );
            expect(
                Object.values(getAllValues(data, path)).every(
                    (val) => val == result
                )
            ).toBe(true);
            data = { person: { "1": { name: ["ahmed"] } } };
            path = "person.*:array.name.*:array";
            result = "ali";
            expect(setAllValues(data, path, result).every((val) => val)).toBe(
                true
            );
            expect(
                Object.values(getAllValues(data, path)).every(
                    (val) => val == result
                )
            ).toBe(true);
            data = {
                person: {
                    "1": { name: ["ahmed"] },
                    "2": { name: ["ali"] },
                },
            };
            path = "person.*:array.name.*:array";
            result = "ali";
            expect(setAllValues(data, path, result).every((val) => val)).toBe(
                true
            );
            expect(
                Object.values(getAllValues(data, path)).every(
                    (val) => val == result
                )
            ).toBe(true);
            data = {
                person: {
                    "1": { name: ["ahmed"] },
                    "2": { name: ["ali", "osama", "elsayed"] },
                },
            };
            path = "person.*:array.name.*:array";
            result = "ali";
            expect(setAllValues(data, path, result).every((val) => val)).toBe(
                true
            );
            expect(
                Object.values(getAllValues(data, path)).every(
                    (val) => val == result
                )
            ).toBe(true);
        });
        it("nested objects", () => {
            let data: any = { person: { name: "osama" } };
            let path = "person.name";
            let result: any = "ali";
            expect(setAllValues(data, path, result).every((val) => val)).toBe(
                true
            );
            expect(
                Object.values(getAllValues(data, path)).every(
                    (val) => val == result
                )
            ).toBe(true);
            data = { person: { friend: { name: "osama" } } };
            path = "person.friend.name";
            result = "ali";
            expect(setAllValues(data, path, result).every((val) => val)).toBe(
                true
            );
            expect(
                Object.values(getAllValues(data, path)).every(
                    (val) => val == result
                )
            ).toBe(true);
            data = { person: { name: "osama" } };
            path = "person.friend.name";
            result = "ali";
            expect(setAllValues(data, path, result).some((val) => val)).toBe(
                false
            );
            expect(
                Object.values(getAllValues(data, path)).some(
                    (val) => val == result
                )
            ).toBe(false);
        });
    });
});
describe("parseRules", () => {
    it("main methods", () => {
        expect(parseRules({ name: "string" })).toStrictEqual({
            name: ["string"],
        });
        expect(parseRules({ name: "string|integer" })).toStrictEqual({
            name: ["string", "integer"],
        });
        expect(parseRules(["string", "integer"])).toStrictEqual({
            ".": ["string", "integer"],
        });
        expect(parseRules([{ name: "string", age: "integer" }])).toStrictEqual({
            "*:array.name": ["string"],
            "*:array.age": ["integer"],
        });
        expect(
            parseRules([[{ name: "string", age: "integer" }]])
        ).toStrictEqual({
            "*:array.*:array.name": ["string"],
            "*:array.*:array.age": ["integer"],
        });

        expect(
            parseRules([[{ name: [["string"]], age: "integer" }]])
        ).toStrictEqual({
            "*:array.*:array.name.*:array": ["string"],
            "*:array.*:array.age": ["integer"],
        });

        expect(parseRules(["string"])).toStrictEqual({ ".": ["string"] });
    });
    describe("array methods", () => {
        it("flattened object", () => {
            expect(parseRules([["string"], "array"])).toStrictEqual({
                "*:array": ["string"],
            });
            expect(
                parseRules([["string"], "array", ["required"]])
            ).toStrictEqual({
                "*:array": ["string"],
                ".": ["required"],
            });
        });
        it("complex object", () => {
            expect(parseRules({ names: [["string"], "array"] })).toStrictEqual({
                "names.*:array": ["string"],
            });
            expect(
                parseRules({ names: [["string"], "array", ["required"]] })
            ).toStrictEqual({
                "names.*:array": ["string"],
                names: ["required"],
            });
            const rules = parseRules({
                name: ["string"],
                age: ["integer"],
                location: [["integer"], "array", ["min:0"]],
                friends: [["string"], "object", ["min:0"]],
            });
            expect(rules).toStrictEqual({
                name: ["string"],
                age: ["integer"],
                "location.*:array": ["integer"],
                "friends.*:object": ["string"],
                location: ["min:0"],
                friends: ["min:0"],
            });
            expect(
                parseRules([
                    { name: "string", password: "string" },
                    "array",
                    ["min:0"],
                ])
            ).toStrictEqual({
                "*:array.name": ["string"],
                "*:array.password": ["string"],
                ".": ["min:0"],
            });
        });
    });
    it("use .", () => {
        expect(
            parseRules({
                ".": ["string"],
            })
        ).toStrictEqual({ ".": ["string"] });
        expect(
            parseRules({
                person: { name: ["string"], ".": "required" },
            })
        ).toStrictEqual({ "person.name": ["string"], person: ["required"] });
    });
});
describe("test construct methods", () => {
    test("main method", () => {
        const rules = parseRules({
            name: ["string"],
            age: ["integer"],
            location: [["integer"], "array", ["min:0"]],
            friends: [["string"], "object", ["min:0"]],
        });
        const res = {
            name: null,
            age: null,
            location: [null, "array", null],
            friends: [null, "object", null],
        };
        expect(constructRule(rules)).toStrictEqual(res);
    });
    test("array object method", () => {
        const rules = parseRules({
            name: ["string"],
            age: ["integer"],
            locations: [{ x: ["integer"], y: ["integer"] }, "array"],
            friends: [{ name: "string", age: "integer" }, "object", ["min:0"]],
            schools: [
                {
                    locations: [
                        {
                            x: ["integer"],
                            y: ["integer"],
                        },
                        "array",
                        ["limit:0"],
                    ],
                    names: [["string"], "array"],
                },
                "object",
            ],
            email: null,
            site: null,
        });
        const res = {
            name: null,
            age: null,
            locations: [{ x: null, y: null }, "array"],
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
                    names: [null, "array"],
                },
                "object",
            ],
            email: null,
            site: null,
        };
        expect(constructRule(rules)).toStrictEqual(res);
    });
    test("flattened array", () => {
        let rules = parseRules([
            { name: "string", password: "string" },
            "array",
        ]);
        let ex: any = [{ name: null, password: null }, "array"];
        expect(constructRule(rules)).toStrictEqual(ex);
        rules = parseRules([
            { name: "string", password: "string" },
            "array",
            ["min:0"],
        ]);
        expect(rules).toStrictEqual({
            "*:array.name": ["string"],
            "*:array.password": ["string"],
            ".": ["min:0"],
        });
        ex = {
            "*:array": [{ name: null, password: null }, "array"],
            ".": null,
        };
        expect(constructRule(rules)).toStrictEqual(ex);
    });
    test("use .", () => {
        const rules = parseRules({
            person: {
                ".": ["required"],
                name: ["string"],
                age: ["integer"],
            },
        });
        const rules2 = parseRules({
            person: {
                name: ["string"],
                age: ["integer"],
                ".": ["required"],
            },
        });
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
        const rules = parseRules({
            name: "string",
            age: ["integer"],
            location: [["integer"], "array", ["limit:0:2"]],
        });
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
        const rules = parseRules({
            name: "string",
            age: ["integer"],
            location: [["integer"], "array", ["limit:0:2"]],
        });
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
        const rules = parseRules({
            friends: [{ name: "string", age: "integer" }],
        });
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
        const rules = parseRules({
            friends: [
                {
                    age: "integer",
                    email: "string",
                    location: [["integer"]],
                    friends: [{ age: ["integer"] }, "object"],
                },
                "object",
            ],
        });
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
    test("main way", () => {
        const obj1 = { name: "ali" };
        const obj2 = { age: 12 };
        expect(mergeObjects(obj1, obj2)).toStrictEqual({
            name: "ali",
            age: 12,
        });
    });
});

describe("inValid attr", () => {
    test("main task", () => {
        const rules = parseRules({
            name: "string|int",
            age: ["integer"],
            location: [["integer"], "array", ["min:0"]],
        });
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
        expect(inValidAttr(f1, rules)).toBeNull();
        expect(inValidAttr(f3, rules)).toBeNull();
        expect(inValidAttr(f2, rules)).not.toBeNull();
    });
    test("array of objects", () => {
        const rules = parseRules({
            friends: [{ name: "string", age: "integer" }],
        });
        const f1 = {
            friends: [
                { name: "mahmoud", age: 14 },
                { name: "ali", age: 12 },
                { name: "osama", age: 12 },
                { name: "ahmed", age: 19 },
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
        expect(inValidAttr(f1, rules)).toBeNull();
        expect(inValidAttr(f2, rules)).not.toBeNull();
    });
    test("object map", () => {
        const rules = parseRules({
            friends: [
                {
                    age: "integer",
                    email: "string",
                    location: [["integer"]],
                    friends: [{ age: ["integer"] }, "object"],
                },
                "object",
            ],
        });
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
        expect(inValidAttr(f1, rules)).toBeNull();
        expect(inValidAttr(f2, rules)).not.toBeNull();
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
