import type Rule from "./Rule";
import type { ValidArray, RulesGetter, RulesNames } from "./utils/isRule";
export * from "./utils/isRule";

export type InputRules =
    | RulesGetter
    | string
    | {
          [name: string]: InputRules;
      }
    | [InputRules]
    | [InputRules, "object" | "array"]
    | [InputRules, "object" | "array", InputRules];
type ArrayRules = Validator.AvailableRules[keyof Validator.AvailableRules][];

type SplitString<
    S extends string,
    Delimiter extends string
> = S extends `${infer Left}${Delimiter}${infer Right}`
    ? [Left, ...SplitString<Right, Delimiter>]
    : [S];

type ToPaths<T, P extends string = ""> = T extends Record<
    string | number,
    unknown
>
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
    : T extends ValidArray
    ?
          | ToPaths<
                T[0],
                `${P extends "" ? "" : `${P}.`}*:${T[1] extends undefined
                    ? "array"
                    : T[1]}`
            >
          | T[2] extends infer R
        ? ToPaths<R, P>
        : never
    : T extends string
    ? SplitString<T, "|"> extends RulesGetter
        ? {
              path: P;
              type: SplitString<T, "|">;
          }
        : never
    : never;

type FromPaths<T extends { path: string; type: RulesGetter }> = {
    [P in T["path"]]: Extract<T, { path: P }>["type"];
};
type AllRulesMap = {
    [K in ArrayRules[number] as K extends Rule<infer Name>
        ? Name & RulesNames
        : never]: K;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never;

export type ValidTypes<T> = T extends Record<string | number, InputRules>
    ? {
          [K in keyof T]: ValidTypes<T[K]>;
      }
    : T extends RulesNames[]
    ? T[number] extends keyof AllRulesMap
        ? UnionToIntersection<
              AllRulesMap[T[number]] extends Rule<string, infer VType>
                  ? VType
                  : unknown
          >
        : unknown
    : T extends ValidArray<InputRules>
    ? T[1] extends "object"
        ? Record<string, ValidTypes<T[0]>> & ValidTypes<T[2]>
        : Array<ValidTypes<T[0]>> & ValidTypes<T[2]>
    : T extends string
    ? ValidTypes<SplitString<T, "|">>
    : unknown;
export type Rules<T> = FromPaths<ToPaths<T>>;
export type G = Rules<unknown>;
