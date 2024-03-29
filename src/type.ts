import type Rule from "@/Rule";
import type { MessagesStore } from "@/Rule";
import type { _Rules } from "@/Rules";
type G = {
    [K in keyof _Rules]: _Rules[K] extends Rule<
        infer Path,
        infer ErrorsType,
        infer Type
    >
        ? {
              path: Path;
              errors: ErrorsType;
              type: Type;
          }
        : never;
};
type _Errors = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof _Rules]: _Rules[K] extends Rule<any, infer ErrorsType, any>
        ? ErrorsType
        : never;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AvailableRules extends G {}
export interface Errors extends _Errors {
    invalidPath: MessagesStore<{ obj: unknown }>;
    unMatchedType: MessagesStore<{ obj: unknown }>;
}
export type RulesNames = {
    [K in keyof AvailableRules]: AvailableRules[K]["path"];
}[keyof AvailableRules];
export type ValidArray<T = unknown> =
    | [T]
    | [T, "object" | "array"]
    | [
          T,
          "object" | "array",
          (
              | ({
                    [name: string | number]: T;
                } & { "."?: RulesGetter })
              | RulesGetter
          )
      ];
export type RulesGetter = Array<RulesNames> | null;
export type InputRules =
    | RulesGetter
    | string
    | ({
          [name: string | number]: InputRules;
      } & { "."?: RulesGetter })
    | [InputRules]
    | [InputRules, "object" | "array"]
    | [
          InputRules,
          "object",
          (
              | ({
                    [name: string]: InputRules;
                } & { "."?: RulesGetter })
              | RulesGetter
          )
      ]
    | [
          InputRules,
          "array",
          (
              | ({
                    [name: number]: InputRules;
                } & { "."?: RulesGetter })
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

type UnionToIntersection<U> = (
    U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
    ? I
    : never;
type ValidG = AvailableRules[keyof AvailableRules];
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
    ? SplitString<T, "|"> extends RulesGetter
        ? ValidTypes<SplitString<T, "|">>
        : unknown
    : unknown;
export type PathRules<T, P extends string = ""> = FromPaths<ToPaths<T, P>>;
