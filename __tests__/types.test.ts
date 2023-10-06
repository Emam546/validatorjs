import Validator, { parseRules } from "@/index";
import { Rules, ValidTypes, RulesGetter } from "@/type";
type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
    ? 1
    : 2
    ? true
    : false;
describe("Test Rules", () => {
    test("empty rule", () => {
        type TestType = Expect<Equal<Rules<{}>, {}>>;
        type TestType2 = Expect<Equal<Rules<[]>, { ".": [] }>>;
    });
    test("normal rules", () => {
        type TestType = Expect<
            Equal<
                Rules<{
                    name: ["string"];
                }>,
                { name: ["string"] }
            >
        >;
        type TestType1 = Expect<
            Equal<
                Rules<{
                    name: "string|integer";
                }>,
                { name: ["string", "integer"] }
            >
        >;
        type TestType3 = Expect<
            Equal<Rules<["string", "integer"]>, { ".": ["string", "integer"] }>
        >;
        type TestType4 = Expect<
            Equal<
                Rules<[{ name: "string"; age: "integer" }]>,
                {
                    "*:array.name": ["string"];
                    "*:array.age": ["integer"];
                }
            >
        >;
        type TestType5 = Expect<
            Equal<
                Rules<[{ name: "string"; age: "integer" }, "object"]>,
                {
                    "*:object.name": ["string"];
                    "*:object.age": ["integer"];
                }
            >
        >;
        type TestType6 = Expect<
            Equal<
                Rules<
                    [{ name: "string"; age: "integer" }, "object", ["string"]]
                >,
                {
                    "*:object.name": ["string"];
                    "*:object.age": ["integer"];
                    ".": ["string"];
                }
            >
        >;
        type TestType7 = Expect<
            Equal<
                Rules<[{ name: "string"; age: "integer" }, "object", {}]>,
                {
                    "*:object.name": ["string"];
                    "*:object.age": ["integer"];
                }
            >
        >;
        type TestType8 = Expect<
            Equal<
                Rules<[{ name: "string"; age: "integer" }, "object", []]>,
                {
                    "*:object.name": ["string"];
                    "*:object.age": ["integer"];
                    ".": [];
                }
            >
        >;
        type TestType9 = Expect<
            Equal<
                Rules<[[{ name: "string"; age: "integer" }]]>,
                {
                    "*:array.*:array.name": ["string"];
                    "*:array.*:array.age": ["integer"];
                }
            >
        >;
        type TestType10 = Expect<
            Equal<
                Rules<[[{ name: [["string"]]; age: "integer" }]]>,
                {
                    "*:array.*:array.name.*:array": ["string"];
                    "*:array.*:array.age": ["integer"];
                }
            >
        >;
        type TestType11 = Expect<
            Equal<
                Rules<[[{ name: [["string"]]; age: "integer" }]]>,
                {
                    "*:array.*:array.name.*:array": ["string"];
                    "*:array.*:array.age": ["integer"];
                }
            >
        >;

        type TestType12 = Expect<
            Equal<
                Rules<{
                    names: [
                        ["string"],
                        "array",
                        {
                            0: ["string"];
                        }
                    ];
                }>,
                {
                    "names.*:array": ["string"];
                    "names.0": ["string"];
                }
            >
        >;
        type TestType13 = Expect<
            Equal<
                Rules<[[{ name: "string"; age: "integer" }]]>,
                {
                    "*:array.*:array.name": ["string"];
                    "*:array.*:array.age": ["integer"];
                }
            >
        >;
    });
});
describe("Test ValidTypes", () => {
    test("empty rule", () => {
        type TestType = Expect<Equal<ValidTypes<{}>, {}>>;
        type TestType2 = Expect<Equal<ValidTypes<[]>, unknown>>;
    });
    test("normal rules", () => {
        type TestType = Expect<
            Equal<
                ValidTypes<{
                    name: ["string"];
                }>,
                { name: string }
            >
        >;
        type TestType1 = Expect<
            Equal<
                ValidTypes<{
                    name: "string|integer";
                }>,
                { name: string & number }
            >
        >;
        type TestType3 = Expect<
            Equal<ValidTypes<["string", "integer"]>, string & number>
        >;
        type TestType4 = Expect<
            Equal<
                ValidTypes<[{ name: "string"; age: "integer" }]>,
                Array<{
                    name: string;
                    age: number;
                }>
            >
        >;
        type TestType5 = Expect<
            Equal<
                ValidTypes<[{ name: "string"; age: "integer" }, "object"]>,
                Record<
                    string,
                    {
                        name: string;
                        age: number;
                    }
                >
            >
        >;
        type TestType6 = Expect<
            Equal<
                ValidTypes<
                    [{ name: "string"; age: "integer" }, "object", ["string"]]
                >,
                Record<
                    string,
                    {
                        name: string;
                        age: number;
                    }
                > &
                    string
            >
        >;
        // type TestType7 = Expect<
        //     Equal<
        //         ValidTypes<[{ name: "string"; age: "integer" }, "object", {}]>,
        //         Record<
        //             string,
        //             {
        //                 name: string;
        //                 age: number;
        //             }
        //         > & {}
        //     >
        // >;
        type TestType8 = Expect<
            Equal<
                ValidTypes<[{ name: "string"; age: "integer" }, "object", []]>,
                Record<
                    string,
                    {
                        name: string;
                        age: number;
                    }
                >
            >
        >;
        type TestType9 = Expect<
            Equal<
                ValidTypes<[[{ name: "string"; age: "integer" }]]>,
                Array<
                    Array<{
                        name: string;
                        age: number;
                    }>
                >
            >
        >;
        type TestType10 = Expect<
            Equal<
                ValidTypes<[[{ name: [["string"]]; age: "integer" }]]>,
                Array<
                    Array<{
                        name: string[];
                        age: number;
                    }>
                >
            >
        >;

        type TestType12 = Expect<
            Equal<
                ValidTypes<{
                    names: [
                        ["string"],
                        "array",
                        {
                            0: ["integer"];
                        }
                    ];
                }>,
                {
                    names: string[] & { 0: number };
                }
            >
        >;
    });
});
describe("Validator ValidTypes", () => {
    test("empty rule", () => {
        const rules = parseRules({
            name: ["string"],
        });
        const input: unknown = { name: "name" };
        const validator = new Validator(input, rules);
        if (validator.passes()) {
        }
    });
});
