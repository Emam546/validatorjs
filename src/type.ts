import type Rule from "./Rule";
import type { ValidArray, RulesGetter } from "./utils/isRule";
export type { ValidArray, RulesGetter } from "./utils/isRule";

export type InputRules =
    | RulesGetter
    | string
    | {
          [name: string]: InputRules;
      }
    | [InputRules]
    | [InputRules, "object" | "array"]
    | [InputRules, "object" | "array", InputRules];
type SplitString<
    S extends string,
    Delimiter extends string
> = S extends `${infer Left}${Delimiter}${infer Right}`
    ? [Left, ...SplitString<Right, Delimiter>]
    : [S];
type ToPaths<T, P extends string = ""> = T extends Record<string, unknown>
    ? {
          [K in keyof T]: ToPaths<
              T[K],
              P extends "" ? `${K & string}` : `${P}.${K & string}`
          >;
      }[keyof T]
    : T extends RulesGetter
    ? { path: P extends `${infer P}` ? P : never; type: T }
    : T extends ValidArray
    ?
          | ToPaths<T[0], `${P}.*:${T[1] extends undefined ? "array" : T[1]}`>
          | T[2] extends InputRules
        ? ToPaths<T[2], P>
        : {
              path: P extends `${infer P}` ? P : never;
              type: T[2] extends RulesGetter ? T[2] : null;
          }
    : T extends string
    ? SplitString<T, "|"> extends RulesGetter
        ? {
              path: P extends `${infer P}` ? P : never;
              type: SplitString<T, "|">;
          }
        : never
    : never;

type FromPaths<T extends { path: string; type: unknown }> = {
    [P in T["path"]]: Extract<T, { path: P }>["type"];
};
type AllRulesMap = {
    [K in Validator.ArrayRules[number] as K extends Rule<infer Name>
        ? Name & Validator.RulesNames
        : never]: K;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I
) => void
    ? I
    : never;

export type ValidTypes<T> = T extends Record<string, InputRules>
    ? {
          [K in keyof T]: ValidTypes<T[K]>;
      }
    : T extends Validator.RulesNames[]
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
