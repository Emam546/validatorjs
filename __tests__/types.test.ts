import Validator, {
  InputRules,
  PathRules,
  ValidTypes,
  AvailableRules,
} from "@/index";
import { GetKeys, RulesNames, UnionToIntersection } from "@/type";

export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;

describe("Test PathRules", () => {
  test("empty rule", () => {
    type TestType = Expect<Equal<PathRules<{}>, {}>>;
    type TestType2 = Expect<Equal<PathRules<[]>, { ".": [] }>>;
  });
  test("normal rules", () => {
    type TestType = Expect<
      Equal<
        PathRules<{
          name: ["string"];
        }>,
        { name: ["string"] }
      >
    >;
    type TestType1 = Expect<
      Equal<
        PathRules<{
          name: "string|integer";
        }>,
        { name: ["string", "integer"] }
      >
    >;
    type TestType3 = Expect<
      Equal<PathRules<["string", "integer"]>, { ".": ["string", "integer"] }>
    >;
    type TestType4 = Expect<
      Equal<
        PathRules<[{ name: "string"; age: "integer" }]>,
        {
          "*:array.name": ["string"];
          "*:array.age": ["integer"];
        }
      >
    >;
    type TestType5 = Expect<
      Equal<
        PathRules<[{ name: "string"; age: "integer" }, "object"]>,
        {
          "*:object.name": ["string"];
          "*:object.age": ["integer"];
        }
      >
    >;
    type TestType6 = Expect<
      Equal<
        PathRules<[{ name: "string"; age: "integer" }, "object", ["string"]]>,
        {
          "*:object.name": ["string"];
          "*:object.age": ["integer"];
          ".": ["string"];
        }
      >
    >;
    type TestType6L2 = Expect<
      Equal<
        PathRules<
          [{ name: "string"; age: "integer" }, "object", { ".": ["required"] }]
        >,
        {
          "*:object.name": ["string"];
          "*:object.age": ["integer"];
          ".": ["required"];
        }
      >
    >;
    type TestType7 = Expect<
      Equal<
        PathRules<[{ name: "string"; age: "integer" }, "object", {}]>,
        {
          "*:object.name": ["string"];
          "*:object.age": ["integer"];
        }
      >
    >;
    type TestType8 = Expect<
      Equal<
        PathRules<[{ name: "string"; age: "integer" }, "object", []]>,
        {
          "*:object.name": ["string"];
          "*:object.age": ["integer"];
          ".": [];
        }
      >
    >;
    type TestType9 = Expect<
      Equal<
        PathRules<[[{ name: "string"; age: "integer" }]]>,
        {
          "*:array.*:array.name": ["string"];
          "*:array.*:array.age": ["integer"];
        }
      >
    >;
    type TestType10 = Expect<
      Equal<
        PathRules<[[{ name: [["string"]]; age: "integer" }]]>,
        {
          "*:array.*:array.name.*:array": ["string"];
          "*:array.*:array.age": ["integer"];
        }
      >
    >;
    type TestType11 = Expect<
      Equal<
        PathRules<[[{ name: [["string"]]; age: "integer" }]]>,
        {
          "*:array.*:array.name.*:array": ["string"];
          "*:array.*:array.age": ["integer"];
        }
      >
    >;

    type TestType12 = Expect<
      Equal<
        PathRules<{
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
        PathRules<[[{ name: "string"; age: "integer" }]]>,
        {
          "*:array.*:array.name": ["string"];
          "*:array.*:array.age": ["integer"];
        }
      >
    >;
    type TestType14 = Expect<
      Equal<
        PathRules<{
          val: {
            ".": ["string"];
          };
        }>,
        {
          val: ["string"];
        }
      >
    >;
  });
  test("complex rules", () => {
    type TestType = Expect<
      Equal<
        PathRules<{
          name: [{ required_if: { path: string; value: string } }];
        }>,
        { name: [{ required_if: { path: string; value: string } }] }
      >
    >;
  });
  test("string types", () => {
    type G = Expect<
      Equal<
        PathRules<{
          val: string;
          correct: "string";
        }>,
        { correct: ["string"] }
      >
    >;
  });
});
describe("Test ValidTypes", () => {
  test("empty rule", () => {
    type G = GetKeys<["required", "string"]>;
    type TestType = Expect<Equal<ValidTypes<{}>, {} | undefined>>;
    type TestType2 = Expect<Equal<ValidTypes<[]>, unknown>>;
  });
  test("normal rules", () => {
    type TestType = Expect<
      Equal<
        ValidTypes<{
          name: ["string"];
        }>,
        { name: string | undefined } | undefined
      >
    >;

    type TestType1 = Expect<
      Equal<
        ValidTypes<{
          name: "string|integer";
        }>,
        { name: (string & number) | undefined } | undefined
      >
    >;

    type TestTypeWithOneInputString = Expect<
      Equal<
        ValidTypes<{
          name: "string";
        }>,
        { name: string | undefined } | undefined
      >
    >;
    type TestType3 = Expect<
      Equal<ValidTypes<["string", "integer"]>, (string & number) | undefined>
    >;

    type TestType4 = Expect<
      Equal<
        ValidTypes<[{ name: "string"; age: "integer" }]>,
        | Array<{
            name: string | undefined;
            age: number | undefined;
          }>
        | undefined
      >
    >;
    type TestType5 = Expect<
      Equal<
        ValidTypes<[{ name: "string"; age: "integer" }, "object"]>,
        | Record<
            string,
            {
              name: string | undefined;
              age: number | undefined;
            }
          >
        | undefined
      >
    >;
    type TestType6 = Expect<
      Equal<
        ValidTypes<[{ name: "string"; age: "integer" }, "object", ["string"]]>,
        | (Record<
            string,
            {
              name: string | undefined;
              age: number | undefined;
            }
          > &
            string)
        | undefined
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
        | Record<
            string,
            {
              name: string | undefined;
              age: number | undefined;
            }
          >
        | undefined
      >
    >;
    type TestType9 = Expect<
      Equal<
        ValidTypes<[[{ name: "string"; age: "integer" }]]>,
        | Array<
            Array<{
              name: string | undefined;
              age: number | undefined;
            }>
          >
        | undefined
      >
    >;
    type TestType10 = Expect<
      Equal<
        ValidTypes<[[{ name: [["string"]]; age: "integer" }]]>,
        | Array<
            Array<{
              name: string[] | undefined;
              age: number | undefined;
            }>
          >
        | undefined
      >
    >;
    type G = ValidTypes<{
      names: [
        ["string"],
        "array",
        {
          0: ["integer"];
        }
      ];
    }>;
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
        | {
            names: (string[] & { 0: number | undefined }) | undefined;
          }
        | undefined
      >
    >;
  });

  test("complex rules", () => {
    type TestType = Expect<
      Equal<
        ValidTypes<{
          name: [{ after: Date }];
        }>,
        { name: unknown | undefined } | undefined
      >
    >;
    type G = ValidTypes<{
      name: [{ different: string }];
    }>;
    type TestType2 = Expect<
      Equal<
        ValidTypes<{
          name: ["string", { different: string }];
        }>,
        { name: string | undefined } | undefined
      >
    >;
  });
  describe("test same cases", () => {
    test("test if the string equals the array", () => {
      type G = Expect<
        Equal<
          ValidTypes<{
            val: ["string"];
          }>,
          ValidTypes<{ val: "string" }>
        >
      >;
    });
  });
  test("test string type", () => {
    type G = Expect<
      Equal<
        ValidTypes<{
          val: string;
        }>,
        { val: unknown } | undefined
      >
    >;
  });
  describe("test boolean", () => {
    type State1 = Expect<Equal<AvailableRules["boolean"]["type"], boolean>>;

    type TestType = Expect<
      Equal<
        ValidTypes<{
          name: ["boolean"];
        }>,
        { name: boolean | undefined } | undefined
      >
    >;
    type TestType2 = Expect<
      Equal<
        ValidTypes<{
          name: ["boolean", "string"];
        }>,
        { name: (boolean & string) | undefined } | undefined
      >
    >;
  });
  type G = ValidTypes<{
    name: ["boolean"];
    ".": ["string"];
  }>;
  describe("Test .", () => {
    type TestType = Expect<
      Equal<
        ValidTypes<{
          name: ["boolean"];
          ".": ["string"];
        }>,
        ({ name: boolean | undefined } & string) | undefined
      >
    >;
    type HasUndefined<T> = undefined extends T ? true : false;

    type T = {
      name: ["boolean"];
      ".": ["required"];
    };
    type S = ValidTypes<T["."]>;
    type TestType2 = Expect<
      Equal<
        ValidTypes<{
          name: ["boolean"];
          ".": ["required"];
        }>,
        { name: boolean | undefined }
      >
    >;
  });
});
describe("test passes method type", () => {
  test("test with normal object", () => {
    type G = { val: ["string"] };
    type ValidG = ValidTypes<G>;
    const validator = new Validator({ val: ["string"] });
    const res = validator.passes({ val: "string" });
    if (res.state) {
      type G = Expect<Equal<typeof res.data, ValidG>>;
    }
  });
});
