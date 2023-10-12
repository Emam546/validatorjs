import type { ValidArray, RulesGetter, RulesNames } from "@/utils/isRule";
export * from "@/utils/isRule";

export type InputRules =
    | RulesGetter
    | string
    | ({
          [name: string]: InputRules;
      } & { "."?: RulesGetter })
    | [InputRules]
    | [InputRules, "object" | "array"]
    | [
          InputRules,
          "object" | "array",
          (
              | {
                    [name: string]: InputRules;
                }
              | RulesGetter
          )
      ];

type SplitString<
    S extends string,
    Delimiter extends string
> = S extends `${infer Left}${Delimiter}${infer Right}`
    ? [Left, ...SplitString<Right, Delimiter>]
    : [S];

type ToPaths<G, P extends string = ""> = G extends infer T
    ? T extends Record<string | number, unknown>
        ? {
              [K in keyof T]: ToPaths<
                  T[K],
                  P extends ""
                      ? `${K & (string | number)}`
                      : `${P}.${K & (string | number)}`
              >;
          }[keyof T]
        : T extends RulesGetter
        ? { path: P extends "" ? "." : P; type: T }
        : T extends ValidArray<InputRules>
        ?
              | ToPaths<
                    T[0],
                    `${P extends "" ? "" : `${P}.`}*:${T[1] extends undefined
                        ? "array"
                        : T[1]}`
                >
              | ToPaths<T[2], P>
        : T extends string
        ? SplitString<T, "|"> extends RulesGetter
            ? ToPaths<SplitString<T, "|">, P>
            : never
        : never
    : never;

type FromPaths<T extends { path: string; type: RulesGetter }> = {
    [P in T["path"]]: Extract<T, { path: P }>["type"];
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never;
type ValidG = Validator.AvailableRules[keyof Validator.AvailableRules];
export type ValidTypes<T> = T extends Record<string | number, InputRules>
    ? {
          [K in keyof T]: ValidTypes<T[K]>;
      }
    : T extends RulesNames[]
    ? UnionToIntersection<
          {
              [P in T[number] as T[number] & string]: Extract<
                  ValidG,
                  { path: P }
              >["type"];
          }[T[number] & string]
      >
    : T extends ValidArray<InputRules>
    ? T[1] extends "object"
        ? Record<string, ValidTypes<T[0]>> & ValidTypes<T[2]>
        : Array<ValidTypes<T[0]>> & ValidTypes<T[2]>
    : T extends string
    ? ValidTypes<SplitString<T, "|">>
    : unknown;

export type PathRules<T, P extends string = ""> = FromPaths<ToPaths<T, P>>;
